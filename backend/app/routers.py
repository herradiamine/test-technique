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

@router.get(
    "/joueurs-scores",
    summary="Scores individuels de tous les joueurs (structure relationnelle)",
    description="Retourne la liste de tous les scores individuels (toutes parties confondues, version relationnelle)."
)
def get_joueurs_scores(db: Session = Depends(get_db)):
    # On parcourt tous les scores individuels et on joint les infos nécessaires
    results = (
        db.query(
            models.ScoreJoueur,
            models.Joueur.nom.label("nom"),
            models.Partie.date_partie,
            models.Partie.taille_grille,
            models.Partie.theme,
            models.Partie.nb_joueurs,
            models.Partie.vainqueur_id,
            models.Score.score_total,
            models.Score.vainqueur
        )
        .join(models.Joueur, models.ScoreJoueur.joueur_id == models.Joueur.id)
        .join(models.Partie, models.ScoreJoueur.partie_id == models.Partie.id)
        .join(models.Score, models.ScoreJoueur.score_id == models.Score.id)
        .all()
    )
    joueurs_scores = []
    for row in results:
        score_joueur = row[0]
        joueurs_scores.append({
            "nom": row.nom,
            "paires": score_joueur.paires,
            # "coups": score_joueur.coups if hasattr(score_joueur, 'coups') else None,  # à ajouter si le champ existe
            "date_partie": row.date_partie,
            "taille_grille": row.taille_grille,
            "theme": row.theme,
            "nb_joueurs": row.nb_joueurs,
            "vainqueur_id": row.vainqueur_id,
            "score_total": row.score_total,
            "vainqueur": row.vainqueur
        })
    return joueurs_scores

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

@router.post(
    "/score_joueur",
    response_model=schemas.ScoreJoueurRead,
    summary="Créer un score individuel pour un joueur dans une partie",
    description="Crée un score_joueur lié à une partie, un joueur et un score global."
)
def create_score_joueur(score_joueur: schemas.ScoreJoueurCreate, db: Session = Depends(get_db)):
    return crud.create_score_joueur(db, score_joueur) 