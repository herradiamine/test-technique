[![CI/CD](https://github.com/amineherradi/test-technique/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/amineherradi/test-technique/actions)

# Backend – Jeu de Mémoire

Ce dossier contient l'API FastAPI (Python 3.12+, Pydantic, SQL) pour le jeu de mémoire.

## Statut des tests

Le badge ci-dessus indique si tous les tests backend passent sur la branche principale (CI/CD GitHub Actions).

## Structure relationnelle
- **joueur** : chaque joueur est unique (nom)
- **partie** : une partie jouée (taille, thème, date, vainqueur)
- **score** : score global de la partie (nombre de coups, etc.)
- **score_joueur** : score individuel d’un joueur pour une partie

## Endpoints principaux (REST)
- `POST /joueurs` : créer/rechercher un joueur (`{ "nom": "Alice" }`)
- `POST /parties` : créer une partie (`{ "taille_grille": "4x4", "theme": "nombres", "nb_joueurs": 2, "vainqueur_id": 1 }`)
- `POST /scores` : créer le score global (`{ "score_total": 18, "vainqueur": "Alice", ... }`)
- `POST /score_joueur` : score individuel (`{ "score_id": 1, "partie_id": 1, "joueur_id": 1, "paires": 6 }`)
- `GET /joueurs-scores` : scores individuels (jointure)
- `GET /stats` : statistiques globales
- `GET /top10` : top 10 des parties
- `GET /themes` : thèmes disponibles

## Séquence d’enregistrement d’une partie
1. Chercher/créer chaque joueur
2. Créer la partie
3. Créer le score global
4. Créer les scores individuels (score_joueur)

## Exemples de payloads
```json
POST /joueurs
{ "nom": "Alice" }

POST /parties
{ "taille_grille": "4x4", "theme": "nombres", "nb_joueurs": 2, "vainqueur_id": 1 }

POST /scores
{ "score_total": 18, "vainqueur": "Alice", "taille_grille": "4x4", "theme": "nombres", "nb_joueurs": 2, "date_partie": "2024-01-01T12:00:00" }

POST /score_joueur
{ "score_id": 1, "partie_id": 1, "joueur_id": 1, "paires": 6 }
```

## Installation
```bash
pip install -r requirements.txt
```

## Initialisation de la base de données
- En développement, les tables sont créées automatiquement au lancement de l’API.
- En CI/CD, la BDD est initialisée avant les tests (voir `ressources/schema.sql` si besoin).

## Lancement en développement
```bash
uvicorn app.main:app --reload
```

## Lancement avec Docker
Voir le README principal et `docker-compose.yml`.

## Tests
- Lancer tous les tests :
  ```bash
  pytest
  ```
- Les tests sont exécutés automatiquement dans la CI (voir badge en haut).

## Documentation API
Swagger : http://localhost:8000/docs

---
Projet réalisé dans le cadre du test technique Clic Campus. 