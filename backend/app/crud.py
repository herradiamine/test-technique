from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional
from sqlalchemy import func

# --- Version simple ---
def create_score(db: Session, score: schemas.ScoreCreate):
    db_score = models.Score(**score.model_dump())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_scores(db: Session, skip: int = 0, limit: int = 10) -> List[models.Score]:
    return db.query(models.Score).offset(skip).limit(limit).all()

# Top 10 des scores (par score_total croissant = meilleur score)
def get_top10_scores(db: Session) -> List[models.Score]:
    return db.query(models.Score).order_by(models.Score.score_total.asc()).limit(10).all()

# Statistiques globales (score moyen, nombre de participations)
def get_stats(db: Session) -> dict:
    # Nombre total de parties (table partie)
    total_games = db.query(models.Partie).count()
    # Nombre de joueurs uniques (table joueur)
    total_players = db.query(models.Joueur).count()
    # Score moyen (moyenne des scores totaux de la table score)
    average_score = db.query(func.avg(models.Score.score_total)).scalar() or 0
    # Temps moyen (moyenne des coups par joueur si le champ existe)
    # Ici, on suppose qu'il y a un champ 'coups' dans ScoreJoueur, sinon on met 0
    coups_list = []
    if hasattr(models.ScoreJoueur, 'coups'):
        coups_list = [sj.coups for sj in db.query(models.ScoreJoueur).all() if sj.coups is not None]
    average_time = sum(coups_list) / len(coups_list) if coups_list else 0
    return {
        "total_games": total_games,
        "total_players": total_players,
        "average_score": float(average_score),
        "average_time": average_time
    }

# --- Version normalisée ---
def create_joueur(db: Session, joueur: schemas.JoueurCreate):
    db_joueur = models.Joueur(**joueur.model_dump())
    db.add(db_joueur)
    db.commit()
    db.refresh(db_joueur)
    return db_joueur

def get_joueur_by_nom(db: Session, nom: str):
    return db.query(models.Joueur).filter(models.Joueur.nom == nom).first()

def create_partie(db: Session, partie: schemas.PartieCreate):
    db_partie = models.Partie(**partie.model_dump())
    db.add(db_partie)
    db.commit()
    db.refresh(db_partie)
    return db_partie

def create_score_joueur(db: Session, score: schemas.ScoreJoueurCreate):
    db_score = models.ScoreJoueur(**score.model_dump())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

def get_parties(db: Session, skip: int = 0, limit: int = 10) -> List[models.Partie]:
    return db.query(models.Partie).offset(skip).limit(limit).all() 