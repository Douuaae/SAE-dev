import sqlite3
from datetime import datetime

DB_PATH = "diffusion.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # permet d'accéder aux colonnes par nom
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Table des lecteurs (un par site)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lecteurs (
            id          TEXT PRIMARY KEY,   -- ex: "site1", "site2"
            nom         TEXT NOT NULL,      -- ex: "Site principal"
            statut      TEXT DEFAULT 'KO',  -- 'UP' ou 'KO'
            last_seen   TEXT,               -- dernière date de heartbeat
            now_playing TEXT,               -- morceau en cours
            playlist_version TEXT           -- version de la playlist locale
        )
    """)

    # Table des logs de diffusion (historique complet)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS diffusion_log (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            lecteur_id  TEXT NOT NULL,
            type        TEXT NOT NULL,  -- 'musique', 'pub', 'urgent'
            contenu     TEXT NOT NULL,  -- nom du fichier / message
            diffuse_le  TEXT NOT NULL   -- horodatage ISO
        )
    """)

    # Table des playlists (version centrale de référence)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS playlists (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            version     TEXT NOT NULL,   -- ex: "v1", "v2"
            fichiers    TEXT NOT NULL,   -- liste JSON des fichiers audio
            cree_le     TEXT NOT NULL
        )
    """)

    # Table des alertes
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alertes (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            lecteur_id  TEXT,
            type        TEXT NOT NULL,  -- 'lecteur_ko', 'playlist_obsolete', 'silence'
            message     TEXT NOT NULL,
            cree_le     TEXT NOT NULL,
            resolue     INTEGER DEFAULT 0  -- 0 = active, 1 = résolue
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Base de données initialisée avec succès")

# --- Fonctions utilitaires pour les lecteurs ---

def upsert_lecteur(lecteur_id: str, nom: str, statut: str, now_playing: str = None, playlist_version: str = None):
    """Crée ou met à jour un lecteur (heartbeat reçu)."""
    conn = get_connection()
    conn.execute("""
        INSERT INTO lecteurs (id, nom, statut, last_seen, now_playing, playlist_version)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            statut = excluded.statut,
            last_seen = excluded.last_seen,
            now_playing = excluded.now_playing,
            playlist_version = excluded.playlist_version
    """, (lecteur_id, nom, statut, datetime.now().isoformat(), now_playing, playlist_version))
    conn.commit()
    conn.close()

def get_all_lecteurs():
    """Retourne tous les lecteurs."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM lecteurs").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def set_lecteur_ko(lecteur_id: str):
    """Passe un lecteur en statut KO."""
    conn = get_connection()
    conn.execute("UPDATE lecteurs SET statut = 'KO' WHERE id = ?", (lecteur_id,))
    conn.commit()
    conn.close()

# --- Fonctions utilitaires pour les logs ---

def log_diffusion(lecteur_id: str, type_: str, contenu: str):
    """Enregistre un événement de diffusion."""
    conn = get_connection()
    conn.execute("""
        INSERT INTO diffusion_log (lecteur_id, type, contenu, diffuse_le)
        VALUES (?, ?, ?, ?)
    """, (lecteur_id, type_, contenu, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_history(limit: int = 50):
    """Retourne les derniers événements de diffusion."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT * FROM diffusion_log
        ORDER BY diffuse_le DESC
        LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Fonctions utilitaires pour les alertes ---

def creer_alerte(lecteur_id: str, type_: str, message: str):
    """Crée une nouvelle alerte."""
    conn = get_connection()
    conn.execute("""
        INSERT INTO alertes (lecteur_id, type, message, cree_le)
        VALUES (?, ?, ?, ?)
    """, (lecteur_id, type_, message, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_alertes_actives():
    """Retourne toutes les alertes non résolues."""
    conn = get_connection()
    rows = conn.execute("""
        SELECT * FROM alertes WHERE resolue = 0
        ORDER BY cree_le DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Fonctions utilitaires pour les playlists ---

def save_playlist(version: str, fichiers: list):
    """Sauvegarde une nouvelle version de playlist."""
    import json
    conn = get_connection()
    conn.execute("""
        INSERT INTO playlists (version, fichiers, cree_le)
        VALUES (?, ?, ?)
    """, (version, json.dumps(fichiers), datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_latest_playlist():
    """Retourne la dernière version de la playlist."""
    import json
    conn = get_connection()
    row = conn.execute("""
        SELECT * FROM playlists ORDER BY id DESC LIMIT 1
    """).fetchone()
    conn.close()
    if row:
        r = dict(row)
        r["fichiers"] = json.loads(r["fichiers"])
        return r
    return None

# Point d'entrée pour tester
if __name__ == "__main__":
    init_db()

    # Données de test
    upsert_lecteur("site1", "Site principal", "UP", "chanson1.mp3", "v1")
    upsert_lecteur("site2", "Site distant 1", "UP", "chanson2.mp3", "v1")
    upsert_lecteur("site3", "Site distant 2", "KO", None, "v0")

    log_diffusion("site1", "musique", "chanson1.mp3")
    log_diffusion("site1", "pub", "pub_coca.mp3")
    log_diffusion("site2", "urgent", "Message évacuation")

    creer_alerte("site3", "lecteur_ko", "Site distant 2 ne répond plus depuis 5 minutes")
    save_playlist("v1", ["chanson1.mp3", "chanson2.mp3", "chanson3.mp3"])

    print("\n📋 Lecteurs :", get_all_lecteurs())
    print("\n📜 Historique :", get_history())
    print("\n🚨 Alertes :", get_alertes_actives())
    print("\n🎵 Playlist :", get_latest_playlist())
