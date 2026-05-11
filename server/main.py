from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import json
from datetime import datetime

from database import (
    init_db, upsert_lecteur, get_all_lecteurs, set_lecteur_ko,
    log_diffusion, get_history,
    creer_alerte, get_alertes_actives,
    save_playlist, get_latest_playlist
)
from scheduler import start_scheduler
from alerts import start_watchdog

app = FastAPI(title="SAÉ Diffusion Musicale", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()
    start_scheduler()
    asyncio.create_task(start_watchdog(manager))

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        message = json.dumps(data)
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({
            "type": "init",
            "lecteurs": get_all_lecteurs(),
            "alertes": get_alertes_actives()
        }))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

class HeartbeatPayload(BaseModel):
    player_id: str
    nom: str
    status: str
    track: Optional[str] = None
    playlist_version: Optional[str] = None

class UrgentPayload(BaseModel):
    message: str
    target: Optional[str] = "all"

class PlaylistPayload(BaseModel):
    version: str
    fichiers: list[str]

@app.get("/")
def root():
    return {"message": "Serveur SAÉ Diffusion Musicale opérationnel 🎵"}

@app.post("/api/heartbeat")
async def heartbeat(payload: HeartbeatPayload):
    statut = "UP" if payload.status in ("playing", "idle") else "KO"
    upsert_lecteur(
        lecteur_id=payload.player_id,
        nom=payload.nom,
        statut=statut,
        now_playing=payload.track,
        playlist_version=payload.playlist_version
    )
    latest = get_latest_playlist()
    if latest and payload.playlist_version != latest["version"]:
        creer_alerte(
            payload.player_id,
            "playlist_obsolete",
            f"{payload.nom} a la playlist {payload.playlist_version} "
            f"mais la version actuelle est {latest['version']}"
        )
    if payload.track:
        log_diffusion(payload.player_id, "musique", payload.track)
    await manager.broadcast({
        "type": "heartbeat",
        "lecteur": {
            "id": payload.player_id,
            "nom": payload.nom,
            "statut": statut,
            "now_playing": payload.track,
            "playlist_version": payload.playlist_version,
            "last_seen": datetime.now().isoformat()
        }
    })
    return {"ok": True, "playlist_actuelle": latest["version"] if latest else None}

@app.get("/api/status")
def get_status():
    return {
        "lecteurs": get_all_lecteurs(),
        "alertes_actives": get_alertes_actives()
    }

@app.post("/api/urgent")
async def send_urgent(payload: UrgentPayload):
    target = payload.target or "all"
    lecteurs = get_all_lecteurs()
    for l in lecteurs:
        if target == "all" or l["id"] == target:
            log_diffusion(l["id"], "urgent", payload.message)
    await manager.broadcast({
        "type": "urgent",
        "message": payload.message,
        "target": target,
        "timestamp": datetime.now().isoformat()
    })
    return {"ok": True, "message": payload.message, "target": target}

@app.get("/api/history")
def get_diffusion_history(limit: int = 50):
    return {"history": get_history(limit)}

@app.post("/api/playlist")
async def update_playlist(payload: PlaylistPayload):
    save_playlist(payload.version, payload.fichiers)
    await manager.broadcast({
        "type": "playlist_update",
        "version": payload.version,
        "fichiers": payload.fichiers
    })
    return {"ok": True, "version": payload.version, "nb_fichiers": len(payload.fichiers)}

@app.get("/api/playlist")
def get_playlist():
    playlist = get_latest_playlist()
    if not playlist:
        raise HTTPException(status_code=404, detail="Aucune playlist disponible")
    return playlist

@app.get("/api/alertes")
def get_alertes():
    return {"alertes": get_alertes_actives()}