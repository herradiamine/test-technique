# Frontend – Jeu de Mémoire

Ce dossier contient l'application frontend développée avec React, Vite, TypeScript et TailwindCSS.

## Spécifications fonctionnelles

- **Pages principales :**
  - Accueil/paramètres : choix de la taille de la grille, du thème (nombres ou icônes), du nombre de joueurs
  - Jeu : grille de cartes, scores, compteur de coups, tour actuel
  - Résultats : récapitulatif de la partie, vainqueur, statistiques, actions pour rejouer ou retourner à l’accueil
  - Top 10 : affichage des meilleurs scores

- **Composants clés :**
  - Grille de cartes responsive et animée
  - Carte (flip, accessibilité, hover/focus)
  - Sélecteurs de paramètres
  - Tableau des scores
  - Chronomètre/compteur de coups
  - Modale de fin de partie

- **Contraintes techniques :**
  - React + Vite
  - TypeScript
  - TailwindCSS pour le style et le responsive
  - Gestion d’état libre (Context, Zustand, Redux, etc.)
  - Appels API vers le backend (scores, top 10, stats)
  - Accessibilité WCAG 2.1 AA (navigation clavier, ARIA, contrastes)
  - Responsive design (mobile, tablette, desktop)

- **Bonus possibles :**
  - Dark/light mode
  - Animation flip fluide
  - Sauvegarde de partie dans le localStorage
  - Internationalisation (i18n) FR/EN

## Installation

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

---

## Structure du projet

- `src/` : code source principal
- `public/` : fichiers statiques
- `index.html` : point d'entrée HTML

---

## Décisions techniques

- Utilisation de Vite pour un développement rapide et un build optimisé
- TailwindCSS pour le style et la gestion du responsive
- TypeScript pour la robustesse du code

---

## Auteur

Projet réalisé dans le cadre du test technique Clic Campus. 