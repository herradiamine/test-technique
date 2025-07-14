import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTop10, getStats } from '../utils/api';
import '/styles/Top10.css';

function Top10() {
  const navigate = useNavigate();
  const [topScores, setTopScores] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, solo, multiplayer
  const [sortBy, setSortBy] = useState('score'); // score, time, date

  useEffect(() => {
    loadTop10();
    loadStats();
  }, [filter, sortBy]);

  const loadTop10 = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTop10();
      let filteredData = data;

      // Appliquer les filtres
      if (filter === 'solo') {
        filteredData = data.filter(score => score.player_count === 1);
      } else if (filter === 'multiplayer') {
        filteredData = data.filter(score => score.player_count === 2);
      }

      // Appliquer le tri
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return b.score - a.score;
          case 'time':
            return a.time_seconds - b.time_seconds;
          case 'date':
            return new Date(b.created_at) - new Date(a.created_at);
          default:
            return b.score - a.score;
        }
      });

      setTopScores(filteredData.slice(0, 10));
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

  if (isLoading) {
    return (
      <div className="top10-container">
        <div className="loading">Chargement du classement...</div>
      </div>
    );
  }

  return (
    <div className="top10-container">
      <div className="top10-header">
        <h1>🏆 Classement Top 10</h1>
        <div className="header-actions">
          <button onClick={handleRefresh} className="btn btn-secondary">
            🔄 Actualiser
          </button>
          <button onClick={handleNewGame} className="btn btn-primary">
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
      <div className="filters-section">
        <div className="filter-group">
          <label>Filtrer par :</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les parties</option>
            <option value="solo">Solo uniquement</option>
            <option value="multiplayer">Multiplayer uniquement</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Trier par :</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="score">Score (décroissant)</option>
            <option value="time">Temps (croissant)</option>
            <option value="date">Date (récent)</option>
          </select>
        </div>
      </div>

      {/* Classement */}
      <div className="leaderboard-section">
        {error ? (
          <div className="error-message">
            {error}
            <button onClick={handleRefresh} className="btn btn-secondary">
              Réessayer
            </button>
          </div>
        ) : topScores.length === 0 ? (
          <div className="empty-state">
            <p>Aucun score enregistré pour le moment.</p>
            <button onClick={handleNewGame} className="btn btn-primary">
              Jouer la première partie !
            </button>
          </div>
        ) : (
          <div className="leaderboard">
            {topScores.map((score, index) => (
              <div key={score.id} className={`leaderboard-item rank-${index + 1}`}>
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>
                <div className="player-info">
                  <div className="player-name">{score.player_name}</div>
                  <div className="game-details">
                    <span className="theme-icon">{getThemeIcon(score.theme)}</span>
                    <span className="grid-size">{score.grid_size}x{score.grid_size}</span>
                    <span className="player-count">
                      {score.player_count === 1 ? 'Solo' : '2 Joueurs'}
                    </span>
                  </div>
                </div>
                <div className="score-info">
                  <div className="score-value">{score.score} paires</div>
                  <div className="score-time">{formatTime(score.time_seconds)}</div>
                </div>
                <div className="score-date">
                  {formatDate(score.created_at)}
                </div>
              </div>
            ))}
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