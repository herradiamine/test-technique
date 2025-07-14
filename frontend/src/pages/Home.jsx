import { useState } from 'react';
import '/styles/Home.css';
import { useNavigate } from 'react-router-dom';
import PlayerCountSelector from '../components/PlayerCountSelector';

function Home() {
  const [mode, setMode] = useState('solo');
  const [gridSize, setGridSize] = useState('grille_4x4');
  const [theme, setTheme] = useState('animaux');
  const [playerCount, setPlayerCount] = useState(1);
  const navigate = useNavigate();

  const handleStart = () => {
    // Convertir les paramètres pour la page de jeu
    const gameParams = {
      playerCount: mode === 'multi' ? playerCount : 1,
      gridSize: gridSize === 'grille_4x4' ? 4 : 6,
      theme: theme
    };

    // Naviguer vers la page de jeu avec les paramètres
    navigate('/game', { state: { gameParams } });
  };

  return (
    <div className="home-container">
      {/* Logo cerveau SVG simple inline */}
      <svg className="home-logo" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#ffb400" strokeWidth="3" /><path d="M16 24c0-4 2-8 8-8s8 4 8 8-2 8-8 8-8-4-8-8z" stroke="#ffb400" strokeWidth="2" fill="none"/></svg>
      <h1 className="home-title">Jeu de Mémoire</h1>
      <div className="home-subtitle">Testez votre mémoire avec ce jeu de concentration classique</div>

      <div className="home-section">
        <div className="home-section-title">Mode de jeu</div>
        <div className="options-row">
          <button className={`radio-btn${mode === 'solo' ? ' selected' : ''}`} onClick={() => setMode('solo')} type="button">
            <span className="icon">👤</span> Solo
          </button>
          <button className={`radio-btn${mode === 'multi' ? ' selected' : ''}`} onClick={() => setMode('multi')} type="button">
            <span className="icon">👥</span> Multijoueur
          </button>
        </div>
      </div>

      {mode === 'multi' && (
        <div className="home-section">
          <div className="home-section-title">Nombre de joueurs</div>
          <PlayerCountSelector count={playerCount} onChange={setPlayerCount} />
        </div>
      )}

      <div className="home-section">
        <div className="home-section-title">Taille de la grille</div>
        <div className="options-row">
          <button className={`radio-btn${gridSize === 'grille_4x4' ? ' selected' : ''}`} onClick={() => setGridSize('grille_4x4')} type="button">
            <span className="icon">🟦</span> 4 × 4 (16 cartes)
          </button>
          <button className={`radio-btn${gridSize === 'grille_6x6' ? ' selected' : ''}`} onClick={() => setGridSize('grille_6x6')} type="button">
            <span className="icon">🟦</span> 6 × 6 (36 cartes)
          </button>
        </div>
      </div>

      <div className="home-section">
        <div className="home-section-title">Thème des cartes</div>
        <div className="options-row">
          <button className={`radio-btn${theme === 'animaux' ? ' selected' : ''}`} onClick={() => setTheme('animaux')} type="button">
            <span className="icon">🐾</span> Animaux
          </button>
          <button className={`radio-btn${theme === 'fruits' ? ' selected' : ''}`} onClick={() => setTheme('fruits')} type="button">
            <span className="icon">🍎</span> Fruits
          </button>
          <button className={`radio-btn${theme === 'emojis' ? ' selected' : ''}`} onClick={() => setTheme('emojis')} type="button">
            <span className="icon">😀</span> Emojis
          </button>
          <button className={`radio-btn${theme === 'chiffres' ? ' selected' : ''}`} onClick={() => setTheme('chiffres')} type="button">
            <span className="icon">#</span> Chiffres
          </button>
        </div>
      </div>

      <div className="home-actions">
        <button className="start-game-btn" onClick={handleStart} type="button">
          Commencer la partie
        </button>
        <button className="top10-btn" type="button" onClick={() => navigate('/top10')}>
          Top 10
        </button>
      </div>
    </div>
  );
}

export default Home; 