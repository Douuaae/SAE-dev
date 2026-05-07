 
import os
import json
import time
import shutil
import requests
from config import (
    SERVER_URL, PLAYER_ID,
    REMOTE_PLAYLIST, LOCAL_PLAYLIST,
    SYNC_INTERVAL
)
 
def is_network_up():
    """Vérifie si le serveur est joignable."""
    try:
        requests.get(SERVER_URL + "/ping", timeout=3)
        return True
    except requests.exceptions.RequestException:
        return False
 
def fetch_playlist_from_server():
    """
    Télécharge la playlist depuis le serveur.
    Retourne True si succès, False sinon.
    """
    try:
        url = f"{SERVER_URL}/api/playlist/{PLAYER_ID}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
 
        playlist = response.json()
 
        # Sauvegarde dans remote.json
        os.makedirs(os.path.dirname(REMOTE_PLAYLIST), exist_ok=True)
        with open(REMOTE_PLAYLIST, "w", encoding="utf-8") as f:
            json.dump(playlist, f, indent=2, ensure_ascii=False)
 
        # Met à jour la playlist locale de secours
        shutil.copy(REMOTE_PLAYLIST, LOCAL_PLAYLIST)
        print(f"[SYNC]  Playlist synchronisée ({len(playlist)} piste(s))")
        return True
 
    except requests.exceptions.RequestException as e:
        print(f"[SYNC]  Serveur injoignable : {e}")
        return False
    except Exception as e:
        print(f"[SYNC]  Erreur inattendue : {e}")
        return False
 
def check_local_fallback():
    """Vérifie que la playlist locale de secours existe."""
    if os.path.exists(LOCAL_PLAYLIST):
        print("[SYNC]   Playlist locale de secours : OK")
        return True
    else:
        print("[SYNC]  Playlist locale de secours : ABSENTE")
        return False
 
def create_dummy_local_playlist(music_dir):
    """
    Crée une playlist locale de secours à partir des mp3 présents.
    Utilisé au premier lancement si le serveur n'est pas encore dispo.
    """
    fichiers = [f for f in os.listdir(music_dir) if f.endswith(".mp3")]
    if not fichiers:
        print("[SYNC]   Aucun mp3 trouvé pour créer la playlist de secours")
        return
 
    playlist = [{"fichier": f, "type": "musique"} for f in fichiers]
 
    os.makedirs(os.path.dirname(LOCAL_PLAYLIST), exist_ok=True)
    with open(LOCAL_PLAYLIST, "w", encoding="utf-8") as f:
        json.dump(playlist, f, indent=2, ensure_ascii=False)
 
    print(f"[SYNC]   Playlist locale de secours créée ({len(playlist)} piste(s))")
 
def sync_loop():
    """
    Boucle de synchronisation continue.
    Toutes les SYNC_INTERVAL secondes :
      - Si réseau OK → tente de récupérer la playlist du serveur
      - Si réseau KO → reste sur la playlist locale
    """
    print("[SYNC] Démarrage de la boucle de synchronisation...")
 
    while True:
        if is_network_up():
            print("[SYNC]  Réseau OK — tentative de synchronisation...")
            fetch_playlist_from_server()
        else:
            print("[SYNC]  Réseau KO — mode dégradé, playlist locale utilisée")
            check_local_fallback()
 
        time.sleep(SYNC_INTERVAL)
 
 
if __name__ == "__main__":
    # Test standalone : simule une synchro
    print("=== Test sync.py ===")
    print(f"Réseau : {'UP' if is_network_up() else 'KO'}")
    check_local_fallback()
 