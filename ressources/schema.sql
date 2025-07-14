-- S'assurer que l'on est bien dans la base 'memory' (utile si exécuté manuellement)
\c memory;

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

-- Jeu de données pour la version simple
INSERT INTO score (joueurs, score_total, vainqueur, taille_grille, theme, nb_joueurs, date_partie) VALUES
  ('[{"nom": "Alice", "paires": 6}, {"nom": "Bob", "paires": 2}]', 18, 'Alice', '4x4', 'icônes', 2, '2024-07-14 10:00:00'),
  ('[{"nom": "Charlie", "paires": 8}]', 20, 'Charlie', '4x4', 'nombres', 1, '2024-07-13 15:30:00'),
  ('[{"nom": "Alice", "paires": 5}, {"nom": "Bob", "paires": 3}, {"nom": "Diane", "paires": 6}]', 25, 'Diane', '6x6', 'icônes', 3, '2024-07-12 18:45:00');

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

-- Jeu de données pour la version normalisée
INSERT INTO joueur (nom) VALUES ('Alice'), ('Bob'), ('Charlie'), ('Diane');

-- Parties :
INSERT INTO partie (taille_grille, theme, nb_joueurs, date_partie, vainqueur_id) VALUES
  ('4x4', 'icônes', 2, '2024-07-14 10:00:00', 1), -- Alice vainqueur
  ('4x4', 'nombres', 1, '2024-07-13 15:30:00', 3), -- Charlie vainqueur
  ('6x6', 'icônes', 3, '2024-07-12 18:45:00', 4);  -- Diane vainqueur

-- Scores individuels par partie
INSERT INTO score_joueur (partie_id, joueur_id, paires) VALUES
  (1, 1, 6), -- Alice, partie 1
  (1, 2, 2), -- Bob, partie 1
  (2, 3, 8), -- Charlie, partie 2
  (3, 1, 5), -- Alice, partie 3
  (3, 2, 3), -- Bob, partie 3
  (3, 4, 6); -- Diane, partie 3 