import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveScore, createPartie, createJoueur, createScoreJoueur, fetchJoueursByNom } from '../utils/api';
import '/styles/Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameData = location.state?.gameData;

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]); // max 4 joueurs
  const [showNameInput, setShowNameInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const mainBtnRef = React.useRef(null);

  // Si pas de données de jeu, rediriger vers l'accueil
  useEffect(() => {
    if (!gameData) {
      navigate('/');
      return;
    }
    setShowNameInput(true); // Toujours afficher le formulaire pour sauvegarder le score
    // Focus auto sur le bouton principal
    setTimeout(() => { mainBtnRef.current?.focus(); }, 200);
    // Sauvegarder les paramètres de la partie courante dans le localStorage
    const paramsToStore = {
      theme: gameData.theme,
      gridSize: gameData.gridSize,
      playerCount: gameData.playerCount
    };
    localStorage.setItem('lastGameParams', JSON.stringify(paramsToStore));
  }, [gameData, navigate]);

  const handleNameChange = (idx, value) => {
    setPlayerNames(prev => prev.map((n, i) => i === idx ? value : n));
  };

  const handleSaveScore = async () => {
    if (playerNames.slice(0, playerCount).some(n => !n.trim())) {
      setErrorMsg('Veuillez entrer le nom de chaque joueur');
      return;
    }
    setErrorMsg('');
    setIsSaving(true);
    try {
      // Mapping du thème pour l’API
      let apiTheme = theme;
      if (["animaux", "fruits", "emojis", "chiffres"].includes(theme)) {
        apiTheme = 'nombres';
      } else if (theme === 'icônes') {
        apiTheme = 'icônes';
      }
      const apiGrid = gridSize === 4 ? '4x4' : '6x6';
      // 1. Chercher ou créer les joueurs
      async function getOrCreateJoueur(nom) {
        const res = await fetchJoueursByNom(nom);
        if (res.data && res.data.length > 0) {
          return res.data[0].id;
        } else {
          const createRes = await createJoueur({ nom });
          return createRes.data?.id || createRes.id;
        }
      }
      const joueurIds = [];
      for (let i = 0; i < playerCount; i++) {
        joueurIds.push(await getOrCreateJoueur(playerNames[i]));
      }
      // 2. Créer la partie
      let vainqueurIdx = 0;
      let maxScore = -Infinity;
      let egalite = false;
      for (let i = 0; i < playerCount; i++) {
        if (scores[i + 1] > maxScore) {
          maxScore = scores[i + 1];
          vainqueurIdx = i;
          egalite = false;
        } else if (scores[i + 1] === maxScore) {
          egalite = true;
        }
      }
      const partieRes = await createPartie({
        taille_grille: apiGrid,
        theme: apiTheme,
        nb_joueurs: playerCount,
        date_partie: new Date().toISOString(),
        vainqueur_id: egalite ? null : joueurIds[vainqueurIdx]
      });
      const partieId = partieRes.data?.id || partieRes.id;
      // 3. Créer le score global
      let vainqueurNom = egalite ? 'Égalité' : playerNames[vainqueurIdx];
      const scoreRes = await saveScore({
        score_total: typeof moveCount === 'number' ? moveCount : 0,
        vainqueur: vainqueurNom,
        taille_grille: apiGrid,
        theme: apiTheme,
        nb_joueurs: playerCount,
        date_partie: new Date().toISOString()
      });
      const scoreId = scoreRes.data?.id || scoreRes.id;
      // 4. Créer les scores individuels
      for (let i = 0; i < playerCount; i++) {
        await createScoreJoueur({
          score_id: scoreId,
          partie_id: partieId,
          joueur_id: joueurIds[i],
          paires: scores[i + 1],
        });
      }
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

  // Relance rapide avec les mêmes paramètres
  const handleQuickRestart = () => {
    const params = localStorage.getItem('lastGameParams');
    if (params) {
      navigate('/game', { state: { gameParams: JSON.parse(params) } });
    }
  };

  if (!gameData) {
    return null;
  }

  const { scores, gameTime, playerCount, theme, gridSize, moveCount, playerMoves } = gameData;
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
                {playerMoves && (
                  <span className="score-label">Coups utilisés : {playerMoves[1]}</span>
                )}
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
                <span className="score-label">Coups : {playerMoves ? playerMoves[1] : '-'}</span>
                {scores[1] > scores[2] && <span className="badge-winner" aria-label="Gagnant">🏆</span>}
              </div>
              <div className={`player-score ${scores[2] > scores[1] ? 'winner' : ''}`} aria-label={`Joueur 2 : ${scores[2]} paires${scores[2] > scores[1] ? ', gagnant' : ''}`}>
                <span className="player-name">Joueur 2</span>
                <span className="score-value">{scores[2]} paires</span>
                <span className="score-label">Coups : {playerMoves ? playerMoves[2] : '-'}</span>
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
              {Array.from({ length: playerCount }).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Nom du joueur ${idx + 1}`}
                  value={playerNames[idx]}
                  onChange={e => handleNameChange(idx, e.target.value)}
                  maxLength={20}
                  className="name-field"
                  aria-label={`Nom du joueur ${idx + 1}`}
                />
              ))}
              <button 
                onClick={handleSaveScore} 
                disabled={isSaving || playerNames.slice(0, playerCount).some(n => !n.trim())}
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
          <button onClick={handleQuickRestart} className="btn btn-primary" aria-label="Relancer rapidement la même partie">
            Relancer rapidement
          </button>
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