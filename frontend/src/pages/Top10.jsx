import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJoueursScores, getStats } from '../utils/api';
import '/styles/Top10.css';

function Top10() {
  const navigate = useNavigate();
  const [topScores, setTopScores] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, solo, multiplayer
  const [sortBy, setSortBy] = useState('score'); // score, time, date
  const mainBtnRef = React.useRef(null);

  useEffect(() => {
    loadTop10();
    loadStats();
    setTimeout(() => { mainBtnRef.current?.focus(); }, 200);
  }, [filter, sortBy]);

  const loadTop10 = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJoueursScores();
      let filteredData = data;

      // Appliquer les filtres
      if (filter === 'solo') {
        filteredData = data.filter(score => score.nb_joueurs === 1);
      } else if (filter === 'multiplayer') {
        filteredData = data.filter(score => score.nb_joueurs > 1);
      }

      // Grouper les scores par partie (avant tri)
      const grouped = groupScoresByPartie(filteredData);

      // Trier les groupes selon le critère choisi
      grouped.sort((a, b) => {
        const partieA = a[0];
        const partieB = b[0];
        switch (sortBy) {
          case 'score':
            // Score total décroissant, puis coups croissant
            return (partieB.paires - partieA.paires) || (partieA.coups - partieB.coups);
          case 'time':
            // Coups croissant
            return partieA.coups - partieB.coups;
          case 'date':
            // Date décroissante (plus récent d'abord)
            return new Date(partieB.date_partie) - new Date(partieA.date_partie);
          default:
            return (partieB.paires - partieA.paires) || (partieA.coups - partieB.coups);
        }
      });

      setTopScores(grouped.slice(0, 10)); // On stocke directement les groupes (parties)
    } catch (err) {
      console.error('Erreur lors du chargement du Top 10:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThemeIcon = (theme) => {
    const icons = {
      animaux: '🐾',
      fruits: '🍎',
      emojis: '😀'
    };
    return icons[theme] || '🎮';
  };

  const handleNewGame = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    loadTop10();
    loadStats();
  };

  const groupScoresByPartie = (scores) => {
    const map = new Map();
    scores.forEach(score => {
      const key = `${score.date_partie}_${score.score_total}_${score.taille_grille}_${score.theme}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(score);
    });
    return Array.from(map.values());
  };

  if (isLoading) {
    return (
      <div className="top10-container">
        <div className="loading">Chargement du classement...</div>
      </div>
    );
  }

  // groupedScores devient simplement topScores (déjà groupé et limité)
  const groupedScores = topScores;

  return (
    <div className="top10-container">
      <div className="top10-header" role="region" aria-labelledby="top10-title">
        <h1 id="top10-title">🏆 Classement Top 10</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary" aria-label="Actualiser le classement">
            🔄 Actualiser
          </button>
          <button ref={mainBtnRef} onClick={handleNewGame} className="btn btn-primary" aria-label="Nouvelle Partie">
            Nouvelle Partie
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      {stats && (
        <div className="stats-section">
          <h2>Statistiques Globales</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.total_games}</span>
              <span className="stat-label">Parties jouées</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.total_players}</span>
              <span className="stat-label">Joueurs uniques</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.average_score?.toFixed(1) || 0}</span>
              <span className="stat-label">Score moyen</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatTime(stats.average_time || 0)}</span>
              <span className="stat-label">Temps moyen</span>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et tri */}
      <div className="filters-section" role="region" aria-label="Filtres du classement">
        <div className="filter-group">
          <label htmlFor="filter-select">Filtrer par :</label>
          <select 
            id="filter-select"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            aria-label="Filtrer le classement"
          >
            <option value="all">Toutes les parties</option>
            <option value="solo">Solo uniquement</option>
            <option value="multiplayer">Multiplayer uniquement</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sort-select">Trier par :</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
            aria-label="Trier le classement"
          >
            <option value="score">Score (décroissant)</option>
            <option value="time">Temps (croissant)</option>
            <option value="date">Date (récent)</option>
          </select>
        </div>
      </div>

      {/* Classement */}
      <div className="leaderboard-section" role="region" aria-label="Tableau du classement">
        {error ? (
          <div className="error-message" role="alert" tabIndex={-1} style={{ color: '#dc3545', marginBottom: 10 }}>
            {error}
            <button onClick={handleRefresh} className="btn btn-secondary" aria-label="Réessayer le chargement du classement">
              Réessayer
            </button>
          </div>
        ) : groupedScores.length === 0 ? (
          <div className="empty-state">
            <p>Aucun score enregistré pour le moment.</p>
            <button onClick={handleNewGame} className="btn btn-primary">
              Jouer la première partie !
            </button>
          </div>
        ) : (
          <div className="leaderboard">
            {groupedScores.map((duo, index) => {
              const partie = duo[0];
              const noms = duo.map(j => j.nom).join(' & ');
              const paires = duo.map(j => j.paires !== undefined ? j.paires : '-').join(' / ');
              const nbJoueurs = partie.nb_joueurs ? (partie.nb_joueurs === 1 ? 'Solo' : partie.nb_joueurs + ' Joueurs') : '1 Joueur';
              const scoreTotal = (partie.score_total !== undefined && partie.score_total !== null && partie.score_total !== 0) ? partie.score_total : '-';
              return (
                <div key={index} className={`leaderboard-item rank-${index + 1}`}>
                  <div className="rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{noms}</div>
                    <div className="game-details">
                      <span className="theme-icon">{getThemeIcon(partie.theme)}</span>
                      <span className="grid-size">{partie.taille_grille ? partie.taille_grille.replace('grille_', '').replace('_', 'x') : '-'}</span>
                      <span className="player-count">{nbJoueurs}</span>
                    </div>
                  </div>
                  <div className="score-info">
                    <div className="score-value">{paires} paires</div>
                    <div className="score-time">Score total partie : {scoreTotal}</div>
                  </div>
                  <div className="score-date">
                    {partie.date_partie ? formatDate(partie.date_partie) : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="top10-actions">
        <button onClick={handleNewGame} className="btn btn-primary">
          Jouer une nouvelle partie
        </button>
        <button onClick={() => navigate('/')} className="btn btn-outline">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default Top10; 