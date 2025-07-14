import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// --- Fonctions pour les endpoints principaux ---
export const fetchThemes = () => api.get('/themes');
export const getTop10 = () => api.get('/top10').then(response => response.data);
export const getStats = () => api.get('/stats').then(response => response.data);
export const fetchScores = (params) => api.get('/scores', { params });
export const saveScore = (data) => api.post('/scores', data).then(response => response.data);

export const fetchParties = (params) => api.get('/parties', { params });
export const createPartie = (data) => api.post('/parties', data);

export const fetchJoueurs = (params) => api.get('/joueurs', { params });
export const createJoueur = (data) => api.post('/joueurs', data);

// --- Fonctions utilitaires ---
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default api; 