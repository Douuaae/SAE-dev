# API du serveur SAÉ Diffusion Musicale

## URL de base
http://TON_IP:8000

## Documentation interactive (toutes les routes testables)
http://TON_IP:8000/docs

---

## Routes disponibles

### GET /
Vérifie que le serveur tourne.

---

### POST /api/heartbeat
**Pour P2 — envoyé toutes les 30s par chaque lecteur**

Body JSON :
{
    "player_id": "site1",
    "nom": "Site principal",
    "status": "playing",
    "track": "chanson1.mp3",
    "playlist_version": "v1"
}

---

### GET /api/status
**Pour P3 — état de tous les lecteurs**

---

### POST /api/urgent
**Pour P3 — bouton message urgent**

Body JSON :
{
    "message": "Evacuation immédiate",
    "target": "all"
}

---

### GET /api/history
**Pour P3 — historique des diffusions**
Paramètre optionnel : ?limit=100

---

### GET /api/playlist
**Pour P2 — récupérer la playlist actuelle**

---

### WebSocket ws://TON_IP:8000/ws
**Pour P3 — mises à jour temps réel**
Events reçus : heartbeat, urgent, alerte, init
