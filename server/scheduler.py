from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import log_diffusion, get_all_lecteurs
from datetime import datetime

scheduler = AsyncIOScheduler()

# ─────────────────────────────────────────────
#  Planning des publicités
# ─────────────────────────────────────────────

# Liste des spots pub disponibles (à adapter avec vos vrais fichiers)
SPOTS_PUB = [
    "pub_coca_cola.mp3",
    "pub_renault.mp3",
    "pub_sncf.mp3",
]

spot_index = 0  # pour alterner les spots

def diffuser_pub():
    """
    Déclenché automatiquement selon le planning.
    Logue la diffusion du spot pub sur tous les lecteurs UP.
    """
    global spot_index
    spot = SPOTS_PUB[spot_index % len(SPOTS_PUB)]
    spot_index += 1

    lecteurs = get_all_lecteurs()
    for lecteur in lecteurs:
        if lecteur["statut"] == "UP":
            log_diffusion(lecteur["id"], "pub", spot)
            print(f" Pub diffusée sur {lecteur['nom']} : {spot} à {datetime.now().strftime('%H:%M')}")

def start_scheduler():
    """
    Démarre le scheduler avec le planning des pubs.
    Modifie les horaires selon vos besoins.
    """
    # Pub toutes les heures pile (ex: 9h, 10h, 11h...)
    scheduler.add_job(diffuser_pub, "cron", minute=0, id="pub_heure")

    # Pub toutes les demi-heures (ex: 9h30, 10h30...)
    scheduler.add_job(diffuser_pub, "cron", minute=30, id="pub_demiheure")

    # Exemple : pub uniquement entre 8h et 20h
    # scheduler.add_job(diffuser_pub, "cron", hour="8-20", minute=0)

    scheduler.start()
    print(" Scheduler publicités démarré")
    print("   → Pub diffusée toutes les heures et demi-heures")
