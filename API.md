# API du serveur SAÉ Diffusion Musicale

## URL de base
http://10.44.25.102:8000

## Documentation interactive
http://10.44.25.102:8000/docs

---

## Routes disponibles

### GET /
Vérifie que le serveur tourne.
Réponse : `{"message": "Serveur SAÉ Diffusion Musicale opérationnel 🎵"}`

---

### POST /api/heartbeat
**Utilisé par : P2 (agent lecteur / Raspberry Pi)**
Envoyé toutes les 30 secondes par chaque lecteur.

Body JSON :
{
    "player_id": "site1",
    "nom": "Site principal",
    "status": "playing",
    "track": "chanson1.mp3",
    "playlist_version": "v1"
}

Réponse :
{
    "ok": true,
    "playlist_actuelle": "v1"
}

---

### GET /api/status
**Utilisé par : P3 (dashboard)**
Retourne l'état de tous les lecteurs.

Réponse :
{
    "lecteurs": [
        {
            "id": "site1",
            "nom": "Site principal",
            "statut": "UP",
            "now_playing": "chanson1.mp3",
            "last_seen": "2026-05-13T10:32:00"
        }
    ],
    "alertes_actives": []
}

---

### POST /api/urgent
**Utilisé par : P3 (bouton dashboard)**
Déclenche un message urgent sur tous les lecteurs.

Body JSON :
{
    "message": "Evacuation immédiate du bâtiment",
    "target": "all"
}

Réponse : `{"ok": true, "message": "...", "target": "all"}`

---

### GET /api/history
**Utilisé par : P3 (historique dashboard)**
Retourne les derniers événements de diffusion.

Paramètre optionnel : ?limit=100

---

### POST /api/playlist
**Utilisé par : P1 (admin)**
Met à jour la playlist centrale.

Body JSON :
{
    "version": "v2",
    "fichiers": ["chanson1.mp3", "chanson2.mp3", "chanson3.mp3"]
}

---

### GET /api/playlist
Retourne la dernière version de la playlist.

---

### WebSocket ws://10.44.25.102:8000/ws
**Utilisé par : P3 (dashboard temps réel)**
Reçoit les événements en temps réel :
- type "heartbeat" → mise à jour état lecteur
- type "urgent"    → message urgent déclenché
- type "alerte"    → lecteur KO détecté
- type "init"      → état complet à la connexion
