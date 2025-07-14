[![CI/CD](https://github.com/amineherradi/test-technique/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/amineherradi/test-technique/actions)

# Frontend – Jeu de Mémoire

Ce dossier contient l'application frontend développée avec React, Vite, TailwindCSS.

## Statut des tests

Le badge ci-dessus indique si les tests frontend passent dans la CI (GitHub Actions).

## Fonctionnalités principales
- Sélection des paramètres (taille de la grille, thème, nombre de joueurs)
- Jeu de mémoire multijoueur ou solo
- Compteur de coups individuel, timer, accessibilité clavier et ARIA
- Résultats détaillés, classement Top 10, statistiques globales
- Responsive et design fidèle à la maquette

## Workflow d’enregistrement (relationnel)
1. Saisie des noms des joueurs
2. Recherche/création des joueurs via l’API
3. Création de la partie
4. Création du score global
5. Création des scores individuels

## Pages principales
- **Accueil** : choix des paramètres
- **Jeu** : grille, scores, tours
- **Résultats** : récapitulatif, vainqueur, progression, actions
- **Top 10** : classement des meilleures parties

## Intégration API
- Utilisation d’Axios pour communiquer avec le backend (voir `src/utils/api.js`)
- Passage des paramètres entre pages via React Router

## Build et lancement avec Docker
- Le build est généré automatiquement lors du `docker-compose up --build`
- Accès à l’application sur http://localhost:4173

## Accessibilité et responsive
- Navigation clavier, ARIA, design responsive (mobile/desktop)

## Installation locale
```bash
npm install
npm run dev
```

---
Projet réalisé dans le cadre du test technique Clic Campus. 
