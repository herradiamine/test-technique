from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

# Version simple (table unique)
class Score(Base):
    __tablename__ = "score"
    id = Column(Integer, primary_key=True)
    joueurs = Column(JSON, nullable=False)
    score_total = Column(Integer, nullable=False)
    vainqueur = Column(String(100))
    taille_grille = Column(String(10), nullable=False)
    theme = Column(String(50), nullable=False)
    nb_joueurs = Column(Integer, nullable=False)
    date_partie = Column(DateTime, server_default=func.now())

# Version normalisée (relationnelle)
class Joueur(Base):
    __tablename__ = "joueur"
    id = Column(Integer, primary_key=True)
    nom = Column(String(100), nullable=False)
    scores = relationship("ScoreJoueur", back_populates="joueur")
    parties_gagnees = relationship("Partie", back_populates="vainqueur", foreign_keys='Partie.vainqueur_id')

class Partie(Base):
    __tablename__ = "partie"
    id = Column(Integer, primary_key=True)
    taille_grille = Column(String(10), nullable=False)
    theme = Column(String(50), nullable=False)
    nb_joueurs = Column(Integer, nullable=False)
    date_partie = Column(DateTime, server_default=func.now())
    vainqueur_id = Column(Integer, ForeignKey("joueur.id"))
    vainqueur = relationship("Joueur", back_populates="parties_gagnees", foreign_keys=[vainqueur_id])
    scores = relationship("ScoreJoueur", back_populates="partie")

class ScoreJoueur(Base):
    __tablename__ = "score_joueur"
    id = Column(Integer, primary_key=True)
    partie_id = Column(Integer, ForeignKey("partie.id"), nullable=False)
    joueur_id = Column(Integer, ForeignKey("joueur.id"), nullable=False)
    paires = Column(Integer, nullable=False)
    partie = relationship("Partie", back_populates="scores")
    joueur = relationship("Joueur", back_populates="scores") 