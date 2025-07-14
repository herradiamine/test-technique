# Backend – Jeu de Mémoire

Ce dossier contient l'API FastAPI (Python 3.12+, Pydantic, SQL).

## Spécifications fonctionnelles

- **Endpoints à implémenter :**
  - `POST /scores` : enregistrer un score de partie
  - `GET /top10` : récupérer le top 10 des scores
  - `GET /stats` : obtenir le score moyen et le nombre total de participations
  - (Bonus) `GET /themes` : fournir des thèmes dynamiques pour les cartes

- **Modèle de données :**
  - Table Score : id, joueurs, score, date, paramètres de partie (taille, thème, nombre de joueurs, etc.)

- **Contraintes techniques :**
  - Python 3.12+
  - FastAPI
  - Pydantic
  - SQLAlchemy (Postgres ou SQLite)
  - Dockerisation
  - Tests unitaires recommandés

- **Bonus possibles :**
  - Pipeline CI/CD (lint, tests, build)
  - Documentation automatique via OpenAPI/Swagger

## Installation

```bash
pip install -r requirements.txt
```

## Lancement en développement

```bash
uvicorn app.main:app --reload
``` 