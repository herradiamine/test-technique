from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

# --- Version simple ---
def create_score(db: Session, score: schemas.ScoreCreate):
    db_score = models.Score(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_scores(db: Session, skip: int = 0, limit: int = 10) -> List[models.Score]:
    return db.query(models.Score).offset(skip).limit(limit).all()

# --- Version normalisée ---
def create_joueur(db: Session, joueur: schemas.JoueurCreate):
    db_joueur = models.Joueur(**joueur.dict())
    db.add(db_joueur)
    db.commit()
    db.refresh(db_joueur)
    return db_joueur

def get_joueur_by_nom(db: Session, nom: str):
    return db.query(models.Joueur).filter(models.Joueur.nom == nom).first()

def create_partie(db: Session, partie: schemas.PartieCreate):
    db_partie = models.Partie(**partie.dict())
    db.add(db_partie)
    db.commit()
    db.refresh(db_partie)
    return db_partie

def create_score_joueur(db: Session, score: schemas.ScoreJoueurCreate):
    db_score = models.ScoreJoueur(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_parties(db: Session, skip: int = 0, limit: int = 10) -> List[models.Partie]:
    return db.query(models.Partie).offset(skip).limit(limit).all() 