# Backend – Jeu de Mémoire

Ce dossier contient l'API FastAPI (Python 3.12+, Pydantic, SQL).

## Spécifications fonctionnelles

- **Endpoints à implémenter :**
  - `POST /scores` : enregistrer un score de partie (version simple)
  - `GET /scores` : récupérer la liste des scores (version simple)
  - `POST /joueurs` : créer un joueur (version normalisée)
  - `POST /parties` : créer une partie (version normalisée)
  - `GET /parties` : récupérer la liste des parties (version normalisée)

## Documentation de l'API

L'API est documentée automatiquement via Swagger/OpenAPI :
- Accès : [http://localhost:8000/docs](http://localhost:8000/docs)

### Endpoints principaux

#### 1. Enregistrer un score (version simple)
- **POST** `/scores`
- **Body exemple :**
```json
{
  "joueurs": [
    {"nom": "Alice", "paires": 6},
    {"nom": "Bob", "paires": 2}
  ],
  "score_total": 18,
  "vainqueur": "Alice",
  "taille_grille": "4x4",
  "theme": "icônes",
  "nb_joueurs": 2
}
```
- **Réponse :**
```json
{
  "id": 1,
  "joueurs": [...],
  "score_total": 18,
  "vainqueur": "Alice",
  "taille_grille": "4x4",
  "theme": "icônes",
  "nb_joueurs": 2,
  "date_partie": "2024-07-14T10:00:00"
}
```

#### 2. Récupérer la liste des scores (version simple)
- **GET** `/scores`
- **Réponse :**
```json
[
  {
    "id": 1,
    "joueurs": [...],
    "score_total": 18,
    "vainqueur": "Alice",
    "taille_grille": "4x4",
    "theme": "icônes",
    "nb_joueurs": 2,
    "date_partie": "2024-07-14T10:00:00"
  },
  ...
]
```

#### 3. Créer un joueur (version normalisée)
- **POST** `/joueurs`
- **Body exemple :**
```json
{
  "nom": "Alice"
}
```
- **Réponse :**
```json
{
  "id": 1,
  "nom": "Alice"
}
```

#### 4. Créer une partie (version normalisée)
- **POST** `/parties`
- **Body exemple :**
```json
{
  "taille_grille": "4x4",
  "theme": "icônes",
  "nb_joueurs": 2,
  "vainqueur_id": 1
}
```
- **Réponse :**
```json
{
  "id": 1,
  "taille_grille": "4x4",
  "theme": "icônes",
  "nb_joueurs": 2,
  "date_partie": "2024-07-14T10:00:00",
  "vainqueur_id": 1
}
```

#### 5. Récupérer la liste des parties (version normalisée)
- **GET** `/parties`
- **Réponse :**
```json
[
  {
    "id": 1,
    "taille_grille": "4x4",
    "theme": "icônes",
    "nb_joueurs": 2,
    "date_partie": "2024-07-14T10:00:00",
    "vainqueur_id": 1
  },
  ...
]
```

---

## Installation

```bash
pip install -r requirements.txt
```

## Lancement en développement

```bash
uvicorn app.main:app --reload
```

---

## Structure du projet

- `main.py` : point d'entrée FastAPI
- `models.py` : modèles SQLAlchemy
- `schemas.py` : schémas Pydantic
- `crud.py` : logique métier (CRUD)
- `database.py` : connexion DB
- `routers.py` : endpoints FastAPI

---

## Auteur

Projet réalisé dans le cadre du test technique Clic Campus. 