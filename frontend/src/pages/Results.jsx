import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveScore } from '../utils/api';
import '/styles/Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Si pas de données de jeu, rediriger vers l'accueil
  useEffect(() => {
    if (!gameData) {
      navigate('/');
      return;
    }

    // Afficher l'input du nom si c'est un jeu solo
    if (gameData.playerCount === 1) {
      setShowNameInput(true);
    }
  }, [gameData, navigate]);

  const handleSaveScore = async () => {
    if (!playerName.trim() && gameData.playerCount === 1) {
      alert('Veuillez entrer votre nom');
      return;
    }

    setIsSaving(true);
    try {
      const scoreData = {
        player_name: gameData.playerCount === 1 ? playerName : 'Multiplayer',
        score: gameData.playerCount === 1 ? gameData.scores[1] : Math.max(gameData.scores[1], gameData.scores[2]),
        time_seconds: gameData.gameTime,
        grid_size: gameData.gridSize,
        theme: gameData.theme,
        player_count: gameData.playerCount,
        game_data: {
          scores: gameData.scores,
          total_pairs: (gameData.gridSize * gameData.gridSize) / 2
        }
      };

      await saveScore(scoreData);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du score');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewGame = () => {
    navigate('/', { 
      state: { 
        gameParams: {
          theme: gameData.theme,
          gridSize: gameData.gridSize,
          playerCount: gameData.playerCount
        }
      }
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewTop10 = () => {
    navigate('/top10');
  };

  if (!gameData) {
    return null;
  }

  const { scores, gameTime, playerCount, theme, gridSize } = gameData;
  const totalPairs = (gridSize * gridSize) / 2;
  const winner = playerCount === 2 ? 
    (scores[1] > scores[2] ? 'Joueur 1' : scores[2] > scores[1] ? 'Joueur 2' : 'Égalité') : 
    null;

  return (
    <div className="results-container">
      <div className="results-card">
        <h1>Résultats de la Partie</h1>
        
        {/* Statistiques de la partie */}
        <div className="game-summary">
          <div className="summary-item">
            <span className="label">Thème:</span>
            <span className="value">{theme}</span>
          </div>
          <div className="summary-item">
            <span className="label">Taille de grille:</span>
            <span className="value">{gridSize}x{gridSize}</span>
          </div>
          <div className="summary-item">
            <span className="label">Mode de jeu:</span>
            <span className="value">{playerCount === 1 ? 'Solo' : '2 Joueurs'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Temps total:</span>
            <span className="value">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Scores */}
        <div className="scores-section">
          <h2>Scores</h2>
          {playerCount === 1 ? (
            <div className="single-player-score">
              <div className="score-display">
                <span className="score-value">{scores[1]}</span>
                <span className="score-label">paires trouvées sur {totalPairs}</span>
              </div>
              <div className="completion-rate">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(scores[1] / totalPairs) * 100}%` }}
                  ></div>
                </div>
                <span>{Math.round((scores[1] / totalPairs) * 100)}% de réussite</span>
              </div>
            </div>
          ) : (
            <div className="multiplayer-scores">
              <div className={`player-score ${scores[1] > scores[2] ? 'winner' : ''}`}>
                <span className="player-name">Joueur 1</span>
                <span className="score-value">{scores[1]} paires</span>
              </div>
              <div className={`player-score ${scores[2] > scores[1] ? 'winner' : ''}`}>
                <span className="player-name">Joueur 2</span>
                <span className="score-value">{scores[2]} paires</span>
              </div>
              {winner && (
                <div className="winner-announcement">
                  <span>🏆 {winner} remporte la partie !</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sauvegarde du score */}
        {showNameInput && (
          <div className="save-score-section">
            <h3>Sauvegarder votre score</h3>
            <div className="name-input">
              <input
                type="text"
                placeholder="Votre nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="name-field"
              />
              <button 
                onClick={handleSaveScore} 
                disabled={isSaving || !playerName.trim()}
                className="btn btn-primary"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
            {saveSuccess && (
              <div className="save-success">
                ✅ Score sauvegardé avec succès !
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="results-actions">
          <button onClick={handleNewGame} className="btn btn-primary">
            Nouvelle Partie
          </button>
          <button onClick={handleViewTop10} className="btn btn-secondary">
            Voir le Top 10
          </button>
          <button onClick={handleGoHome} className="btn btn-outline">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results; 