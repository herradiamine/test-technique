-- Schéma SQL pour le jeu de mémoire (Memory)
-- Compatible PostgreSQL

-- =====================
-- VERSION SIMPLE (table unique)
-- =====================
CREATE TABLE IF NOT EXISTS score (
    id SERIAL PRIMARY KEY,
    joueurs JSONB NOT NULL, -- Liste des joueurs et éventuellement leurs scores individuels
    score_total INTEGER NOT NULL, -- Score total ou nombre de coups pour la partie
    vainqueur VARCHAR(100), -- Nom ou identifiant du vainqueur
    taille_grille VARCHAR(10) NOT NULL, -- '4x4' ou '6x6'
    theme VARCHAR(50) NOT NULL, -- 'nombres', 'icônes', etc.
    nb_joueurs INTEGER NOT NULL,
    date_partie TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les requêtes sur le top 10
CREATE INDEX IF NOT EXISTS idx_score_total ON score (score_total);
CREATE INDEX IF NOT EXISTS idx_date_partie ON score (date_partie);

-- Exemple de structure JSON pour le champ joueurs :
-- [
--   {"nom": "Alice", "paires": 5},
--   {"nom": "Bob", "paires": 3}
-- ]

-- =====================
-- VERSION NORMALISÉE (relationnelle)
-- =====================

-- Table des joueurs
CREATE TABLE IF NOT EXISTS joueur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table des parties
CREATE TABLE IF NOT EXISTS partie (
    id SERIAL PRIMARY KEY,
    taille_grille VARCHAR(10) NOT NULL, -- '4x4' ou '6x6'
    theme VARCHAR(50) NOT NULL, -- 'nombres', 'icônes', etc.
    nb_joueurs INTEGER NOT NULL,
    date_partie TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vainqueur_id INTEGER REFERENCES joueur(id)
);

-- Table d'association score_joueur (score individuel par partie)
CREATE TABLE IF NOT EXISTS score_joueur (
    id SERIAL PRIMARY KEY,
    partie_id INTEGER NOT NULL REFERENCES partie(id) ON DELETE CASCADE,
    joueur_id INTEGER NOT NULL REFERENCES joueur(id) ON DELETE CASCADE,
    paires INTEGER NOT NULL -- Nombre de paires trouvées par ce joueur dans cette partie
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_partie_date ON partie (date_partie);
CREATE INDEX IF NOT EXISTS idx_score_joueur_partie ON score_joueur (partie_id);
CREATE INDEX IF NOT EXISTS idx_score_joueur_joueur ON score_joueur (joueur_id); 