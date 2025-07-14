from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# --- Version simple ---
class JoueurScoreSimple(BaseModel):
    nom: str
    paires: int

class ScoreBase(BaseModel):
    joueurs: List[JoueurScoreSimple]
    score_total: int
    vainqueur: Optional[str]
    taille_grille: str
    theme: str
    nb_joueurs: int
    date_partie: Optional[datetime] = None

class ScoreCreate(ScoreBase):
    pass

class ScoreRead(ScoreBase):
    id: int
    class Config:
        orm_mode = True

# --- Version normalisée ---
class JoueurBase(BaseModel):
    nom: str

class JoueurCreate(JoueurBase):
    pass

class JoueurRead(JoueurBase):
    id: int
    class Config:
        orm_mode = True

class PartieBase(BaseModel):
    taille_grille: str
    theme: str
    nb_joueurs: int
    date_partie: Optional[datetime] = None
    vainqueur_id: Optional[int] = None

class PartieCreate(PartieBase):
    pass

class PartieRead(PartieBase):
    id: int
    class Config:
        orm_mode = True

class ScoreJoueurBase(BaseModel):
    partie_id: int
    joueur_id: int
    paires: int

class ScoreJoueurCreate(ScoreJoueurBase):
    pass

class ScoreJoueurRead(ScoreJoueurBase):
    id: int
    class Config:
        orm_mode = True 