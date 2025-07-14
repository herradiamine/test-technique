# Jeu de Mémoire – Test Technique Clic Campus

Ce projet est une application fullstack de jeu de mémoire (Memory) développée pour un test technique. Il est composé d’un frontend React (Vite, TailwindCSS) et d’un backend FastAPI (Python, SQLAlchemy, Pydantic) orchestrés avec Docker et Docker Compose.

## Structure du projet

- `/frontend` : Application React (Vite, TailwindCSS)
- `/backend` : API FastAPI (Python, Pydantic, SQL)
- `/ressources` : Schéma SQL, collection Postman
- `docker-compose.yml` : Orchestration des services

## Lancement rapide

```bash
docker-compose up --build
```
- Le frontend est accessible sur http://localhost:4173
- Le backend (API) sur http://localhost:8000/docs (Swagger)
- La base de données Postgres est initialisée automatiquement

## Architecture relationnelle

- **joueur** : chaque joueur est unique (nom)
- **partie** : une partie jouée (taille, thème, date, vainqueur)
- **score** : score global de la partie (nombre de coups, etc.)
- **score_joueur** : score individuel d’un joueur pour une partie

## Séquence d’enregistrement d’une partie
1. Recherche/création des joueurs
2. Création de la partie
3. Création du score global
4. Création des scores individuels (score_joueur)

## Utilisation de Postman
- Importez `ressources/postman_collection.json` pour tester tous les endpoints REST.

## Documentation
- **Backend** : Swagger/OpenAPI sur http://localhost:8000/docs
- **Frontend** : voir `/frontend/README.md`
- **Backend** : voir `/backend/README.md`

---
Projet réalisé dans le cadre du test technique Clic Campus. 