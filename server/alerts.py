import asyncio
from datetime import datetime, timedelta
from database import get_all_lecteurs, set_lecteur_ko, creer_alerte

# Délai max sans heartbeat avant de considérer un lecteur KO (en secondes)
HEARTBEAT_TIMEOUT = 90   # 1min30 — le lecteur envoie normalement toutes les 30s

async def start_watchdog(manager):
    """
    Tourne en arrière-plan toutes les 60 secondes.
    Vérifie que chaque lecteur a envoyé un heartbeat récent.
    Si non → passe en KO + crée une alerte + notifie le dashboard.
    """
    print("🔍 Watchdog démarré")
    while True:
        await asyncio.sleep(60)
        check_lecteurs(manager)

def check_lecteurs(manager):
    lecteurs = get_all_lecteurs()
    now = datetime.now()

    for lecteur in lecteurs:
        if not lecteur["last_seen"]:
            continue

        last_seen = datetime.fromisoformat(lecteur["last_seen"])
        delta = (now - last_seen).total_seconds()

        if delta > HEARTBEAT_TIMEOUT and lecteur["statut"] == "UP":
            # Le lecteur ne répond plus → on le passe KO
            set_lecteur_ko(lecteur["id"])

            message = (
                f"{lecteur['nom']} ne répond plus depuis "
                f"{int(delta // 60)} min {int(delta % 60)} sec"
            )
            creer_alerte(lecteur["id"], "lecteur_ko", message)

            print(f"🚨 ALERTE : {message}")

            # Notifie le dashboard (appel synchrone depuis un contexte async)
            asyncio.create_task(manager.broadcast({
                "type": "alerte",
                "lecteur_id": lecteur["id"],
                "alerte": "lecteur_ko",
                "message": message,
                "timestamp": now.isoformat()
            }))
