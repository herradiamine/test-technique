from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from . import crud, schemas, models, database
from typing import List

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Version simple ---
@router.post(
    "/scores",
    response_model=schemas.ScoreRead,
    summary="Enregistrer un score (version simple)",
    description="Enregistre le résultat d'une partie (joueurs, scores, paramètres, etc.) dans la table simple."
)
def create_score(score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    return crud.create_score(db, score)

@router.get(
    "/scores",
    response_model=List[schemas.ScoreRead],
    summary="Lister les scores (version simple)",
    description="Récupère la liste paginée des scores enregistrés (version simple)."
)
def read_scores(
    skip: int = Query(0, description="Nombre d'éléments à ignorer pour la pagination"),
    limit: int = Query(10, le=100, description="Nombre maximum d'éléments à retourner (max 100)"),
    db: Session = Depends(get_db)
):
    return crud.get_scores(db, skip=skip, limit=limit)

@router.get(
    "/top10",
    response_model=List[schemas.ScoreRead],
    summary="Top 10 des scores",
    description="Retourne le top 10 des meilleurs scores (par score_total croissant)."
)
def get_top10(db: Session = Depends(get_db)):
    return crud.get_top10_scores(db)

@router.get(
    "/stats",
    summary="Statistiques globales",
    description="Retourne le score moyen et le nombre total de participations."
)
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

@router.get(
    "/themes",
    summary="Thèmes disponibles",
    description="Retourne la liste des thèmes disponibles pour le jeu."
)
def get_themes():
    return ["nombres", "icônes"]

# --- Version normalisée (exemples) ---
@router.post(
    "/joueurs",
    response_model=schemas.JoueurRead,
    summary="Créer un joueur (version normalisée)",
    description="Crée un nouveau joueur dans la base de données."
)
def create_joueur(joueur: schemas.JoueurCreate, db: Session = Depends(get_db)):
    return crud.create_joueur(db, joueur)

@router.post(
    "/parties",
    response_model=schemas.PartieRead,
    summary="Créer une partie (version normalisée)",
    description="Crée une nouvelle partie avec ses paramètres et le vainqueur."
)
def create_partie(partie: schemas.PartieCreate, db: Session = Depends(get_db)):
    return crud.create_partie(db, partie)

@router.get(
    "/parties",
    response_model=List[schemas.PartieRead],
    summary="Lister les parties (version normalisée)",
    description="Récupère la liste paginée des parties enregistrées."
)
def read_parties(
    skip: int = Query(0, description="Nombre d'éléments à ignorer pour la pagination"),
    limit: int = Query(10, le=100, description="Nombre maximum d'éléments à retourner (max 100)"),
    db: Session = Depends(get_db)
):
    return crud.get_parties(db, skip=skip, limit=limit) 