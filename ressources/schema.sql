-- Schéma SQL pour le jeu de mémoire (Memory)
-- Compatible PostgreSQL

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