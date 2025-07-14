from fastapi import FastAPI
from . import models, database
from .routers import router

app = FastAPI()

# Crée les tables si elles n'existent pas
models.Base.metadata.create_all(bind=database.engine)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "API Jeu de Mémoire opérationnelle"} 