from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import router

app = FastAPI(
    title="API Jeu de Mémoire",
    description="""
API pour le jeu de mémoire (test technique Clic Campus).

## Structure relationnelle
- **joueur** : chaque joueur est unique (nom)
- **partie** : une partie jouée (taille, thème, date, vainqueur)
- **score** : score global de la partie (nombre de coups, etc.)
- **score_joueur** : score individuel d’un joueur pour une partie

## Séquence d’enregistrement d’une partie
1. Chercher/créer chaque joueur
2. Créer la partie
3. Créer le score global
4. Créer les scores individuels (score_joueur)

## Endpoints principaux
- POST /joueurs
- POST /parties
- POST /scores
- POST /score_joueur
- GET /joueurs-scores
- GET /stats
""",
    version="1.0.0",
    contact={
        "name": "Clic Campus",
        "email": "contact@clic-campus.fr"
    },
    openapi_tags=[
        {"name": "Joueurs", "description": "Gestion des joueurs (création, recherche)"},
        {"name": "Parties", "description": "Gestion des parties"},
        {"name": "Scores", "description": "Scores globaux et individuels"},
        {"name": "Statistiques", "description": "Statistiques globales et top 10"}
    ]
)

# Middleware CORS (à restreindre en prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crée les tables si elles n'existent pas
models.Base.metadata.create_all(bind=database.engine)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "API Jeu de Mémoire opérationnelle"}

# Gestion globale des erreurs
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Erreur interne du serveur."}
    ) 