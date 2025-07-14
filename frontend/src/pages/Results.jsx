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
  const [errorMsg, setErrorMsg] = useState('');
  const mainBtnRef = React.useRef(null);

  // Si pas de données de jeu, rediriger vers l'accueil
  useEffect(() => {
    if (!gameData) {
      navigate('/');
      return;
    }
    if (gameData.playerCount === 1) {
      setShowNameInput(true);
    }
    // Focus auto sur le bouton principal
    setTimeout(() => { mainBtnRef.current?.focus(); }, 200);
  }, [gameData, navigate]);

  const handleSaveScore = async () => {
    if (!playerName.trim() && gameData.playerCount === 1) {
      setErrorMsg('Veuillez entrer votre nom');
      return;
    }
    setErrorMsg('');
    setIsSaving(true);
    try {
      // Mapping du thème pour l'API
      let apiTheme = theme;
      if (theme === 'animaux' || theme === 'fruits' || theme === 'emojis' || theme === 'chiffres') {
        apiTheme = 'nombres'; // fallback pour l'API qui n'accepte que 'nombres' ou 'icônes'
      } else if (theme === 'icônes') {
        apiTheme = 'icônes';
      }
      // Mapping de la taille de grille
      const apiGrid = gridSize === 4 ? '4x4' : '6x6';
      // Construction des joueurs
      let joueurs = [];
      if (playerCount === 1) {
        joueurs = [{ nom: playerName, paires: scores[1] }];
      } else {
        joueurs = [
          { nom: 'Joueur 1', paires: scores[1] },
          { nom: 'Joueur 2', paires: scores[2] }
        ];
      }
      // Vainqueur
      let vainqueur = playerName;
      if (playerCount === 2) {
        if (scores[1] > scores[2]) vainqueur = 'Joueur 1';
        else if (scores[2] > scores[1]) vainqueur = 'Joueur 2';
        else vainqueur = 'Égalité';
      }
      const scoreData = {
        joueurs,
        score_total: typeof moveCount === 'number' ? moveCount : 0,
        vainqueur,
        taille_grille: apiGrid,
        theme: apiTheme,
        nb_joueurs: playerCount,
        date_partie: new Date().toISOString()
      };
      await saveScore(scoreData);
      setSaveSuccess(true);
    } catch (error) {
      setErrorMsg('Erreur lors de la sauvegarde du score');
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

  const { scores, gameTime, playerCount, theme, gridSize, moveCount } = gameData;
  const totalPairs = (gridSize * gridSize) / 2;
  const winner = playerCount === 2 ? 
    (scores[1] > scores[2] ? 'Joueur 1' : scores[2] > scores[1] ? 'Joueur 2' : 'Égalité') : 
    null;

  return (
    <div className="results-container">
      <div className="results-card" role="region" aria-labelledby="results-title">
        <h1 id="results-title">Résultats de la Partie</h1>
        
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
          <div className="summary-item">
            <span className="label">Coups :</span>
            <span className="value">{moveCount ?? '-'}</span>
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
              <div className={`player-score ${scores[1] > scores[2] ? 'winner' : ''}`} aria-label={`Joueur 1 : ${scores[1]} paires${scores[1] > scores[2] ? ', gagnant' : ''}`}>
                <span className="player-name">Joueur 1</span>
                <span className="score-value">{scores[1]} paires</span>
                {scores[1] > scores[2] && <span className="badge-winner" aria-label="Gagnant">🏆</span>}
              </div>
              <div className={`player-score ${scores[2] > scores[1] ? 'winner' : ''}`} aria-label={`Joueur 2 : ${scores[2]} paires${scores[2] > scores[1] ? ', gagnant' : ''}`}>
                <span className="player-name">Joueur 2</span>
                <span className="score-value">{scores[2]} paires</span>
                {scores[2] > scores[1] && <span className="badge-winner" aria-label="Gagnant">🏆</span>}
              </div>
              {winner && (
                <div className="winner-announcement" role="status" aria-live="polite">
                  <span>🏆 {winner} remporte la partie !</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Message d'erreur accessible */}
        {errorMsg && (
          <div className="error-message" role="alert" tabIndex={-1} style={{ color: '#dc3545', marginBottom: 10 }}>
            {errorMsg}
          </div>
        )}
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
                aria-label="Votre nom"
              />
              <button 
                onClick={handleSaveScore} 
                disabled={isSaving || !playerName.trim()}
                className="btn btn-primary"
                aria-label="Sauvegarder le score"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
            {saveSuccess && (
              <div className="save-success" role="status" aria-live="polite">
                ✅ Score sauvegardé avec succès !
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="results-actions">
          <button ref={mainBtnRef} onClick={handleNewGame} className="btn btn-primary" aria-label="Nouvelle Partie">
            Nouvelle Partie
          </button>
          <button onClick={handleViewTop10} className="btn btn-secondary" aria-label="Voir le Top 10">
            Voir le Top 10
          </button>
          <button onClick={handleGoHome} className="btn btn-outline" aria-label="Retour à l'accueil">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results; 