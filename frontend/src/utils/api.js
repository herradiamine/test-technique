import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// --- Fonctions pour les endpoints principaux ---
export const fetchThemes = () => api.get('/themes');
export const fetchTop10 = () => api.get('/top10');
export const fetchStats = () => api.get('/stats');
export const fetchScores = (params) => api.get('/scores', { params });
export const createScore = (data) => api.post('/scores', data);

export const fetchParties = (params) => api.get('/parties', { params });
export const createPartie = (data) => api.post('/parties', data);

export const fetchJoueurs = (params) => api.get('/joueurs', { params });
export const createJoueur = (data) => api.post('/joueurs', data);

export default api; 