import os
 
# Dossiers
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, "music")
PLAYLIST_DIR = os.path.join(BASE_DIR, "playlist")
 
# Fichiers playlist
REMOTE_PLAYLIST = os.path.join(PLAYLIST_DIR, "remote.json")   # reçue du serveur
LOCAL_PLAYLIST = os.path.join(PLAYLIST_DIR, "local.json")     # secours locale
 
# Serveur (pas encore dispo, on simule)
SERVER_URL = "http://localhost:5000"
PLAYER_ID = "lecteur-01"
 
# Intervalles
SYNC_INTERVAL = 30        # secondes entre chaque tentative de sync
HEARTBEAT_INTERVAL = 10   # secondes entre chaque envoi d'état au serveur
 