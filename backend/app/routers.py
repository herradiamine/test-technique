from fastapi import APIRouter, Depends, HTTPException
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
@router.post("/scores", response_model=schemas.ScoreRead)
def create_score(score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    return crud.create_score(db, score)

@router.get("/scores", response_model=List[schemas.ScoreRead])
def read_scores(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_scores(db, skip=skip, limit=limit)

@router.get("/top10", response_model=List[schemas.ScoreRead])
def get_top10(db: Session = Depends(get_db)):
    return crud.get_top10_scores(db)

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)

@router.get("/themes")
def get_themes():
    """Retourne la liste des thèmes disponibles pour le jeu."""
    return ["nombres", "icônes"]

# --- Version normalisée (exemples) ---
@router.post("/joueurs", response_model=schemas.JoueurRead)
def create_joueur(joueur: schemas.JoueurCreate, db: Session = Depends(get_db)):
    return crud.create_joueur(db, joueur)

@router.post("/parties", response_model=schemas.PartieRead)
def create_partie(partie: schemas.PartieCreate, db: Session = Depends(get_db)):
    return crud.create_partie(db, partie)

@router.get("/parties", response_model=List[schemas.PartieRead])
def read_parties(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_parties(db, skip=skip, limit=limit) 