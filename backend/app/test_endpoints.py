import pytest
from fastapi.testclient import TestClient
from .main import app
from datetime import datetime

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_get_joueurs_scores():
    response = client.get("/joueurs-scores")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_scores():
    response = client.get("/scores")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_top10():
    response = client.get("/top10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_stats():
    response = client.get("/stats")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_get_themes():
    response = client.get("/themes")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_parties():
    response = client.get("/parties")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_post_joueur():
    payload = {"nom": "Testeur"}
    response = client.post("/joueurs", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["nom"] == "Testeur"
    assert "id" in data

def test_post_partie():
    payload = {
        "taille_grille": "4x4",
        "theme": "nombres",
        "nb_joueurs": 1,
        "date_partie": datetime.now().isoformat(),
        "vainqueur_id": None
    }
    response = client.post("/parties", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["taille_grille"] == "4x4"
    assert data["theme"] == "nombres"
    assert "id" in data

def test_post_score():
    payload = {
        "score_total": 42,
        "vainqueur": "Testeur",
        "taille_grille": "4x4",
        "theme": "nombres",
        "nb_joueurs": 1,
        "date_partie": datetime.now().isoformat()
    }
    response = client.post("/scores", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["score_total"] == 42
    assert data["theme"] == "nombres"
    assert "id" in data

def test_post_score_joueur():
    # Pour ce test, il faut d'abord créer un joueur, une partie et un score
    joueur_resp = client.post("/joueurs", json={"nom": "Testeur2"})
    partie_resp = client.post("/parties", json={
        "taille_grille": "4x4",
        "theme": "nombres",
        "nb_joueurs": 1,
        "date_partie": datetime.now().isoformat(),
        "vainqueur_id": None
    })
    score_resp = client.post("/scores", json={
        "score_total": 24,
        "vainqueur": "Testeur2",
        "taille_grille": "4x4",
        "theme": "nombres",
        "nb_joueurs": 1,
        "date_partie": datetime.now().isoformat()
    })
    assert joueur_resp.status_code in (200, 201)
    assert partie_resp.status_code in (200, 201)
    assert score_resp.status_code in (200, 201)
    joueur_id = joueur_resp.json()["id"]
    partie_id = partie_resp.json()["id"]
    score_id = score_resp.json()["id"]
    payload = {
        "score_id": score_id,
        "partie_id": partie_id,
        "joueur_id": joueur_id,
        "paires": 5
    }
    response = client.post("/score_joueur", json=payload)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["score_id"] == score_id
    assert data["partie_id"] == partie_id
    assert data["joueur_id"] == joueur_id
    assert data["paires"] == 5
    assert "id" in data 