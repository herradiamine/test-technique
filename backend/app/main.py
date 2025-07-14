from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import router

app = FastAPI()

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