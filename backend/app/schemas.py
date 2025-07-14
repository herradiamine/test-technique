from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, validator
from enum import Enum

# --- Enums pour validation stricte ---
class ThemeEnum(str, Enum):
    nombres = "nombres"
    icônes = "icônes"

class TailleGrilleEnum(str, Enum):
    grille_4x4 = "4x4"
    grille_6x6 = "6x6"

# --- Version simple ---
class JoueurScoreSimple(BaseModel):
    nom: str
    paires: int = Field(..., ge=0)

class ScoreBase(BaseModel):
    joueurs: List[JoueurScoreSimple]
    score_total: int = Field(..., ge=0)
    vainqueur: Optional[str]
    taille_grille: TailleGrilleEnum
    theme: ThemeEnum
    nb_joueurs: int = Field(..., ge=1, le=4)
    date_partie: Optional[datetime] = None

    @validator('joueurs')
    def check_nb_joueurs(cls, v, values):
        nb = values.get('nb_joueurs')
        if nb is not None and len(v) != nb:
            raise ValueError('Le nombre de joueurs ne correspond pas à nb_joueurs')
        return v

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
    taille_grille: TailleGrilleEnum
    theme: ThemeEnum
    nb_joueurs: int = Field(..., ge=1, le=4)
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
    paires: int = Field(..., ge=0)

class ScoreJoueurCreate(ScoreJoueurBase):
    pass

class ScoreJoueurRead(ScoreJoueurBase):
    id: int
    class Config:
        orm_mode = True 