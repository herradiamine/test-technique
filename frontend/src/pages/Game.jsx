import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '/styles/Game.css';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const gameParams = location.state?.gameParams || {};

  // État du jeu
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [gameTime, setGameTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [playerMoves, setPlayerMoves] = useState({ 1: 0, 2: 0 });
  const [isBlocked, setIsBlocked] = useState(false);

  // Paramètres du jeu
  const { theme = 'animaux', gridSize = 4, playerCount = 1 } = gameParams;

  // Initialisation du jeu
  useEffect(() => {
    initializeGame();
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initializeGame = () => {
    setIsLoading(true);
    // Logique d'initialisation des cartes selon le thème et la taille
    const cardCount = gridSize * gridSize;
    const pairs = cardCount / 2;
    
    // Générer les cartes (à implémenter selon le thème)
    const gameCards = generateCards(pairs, theme);
    setCards(gameCards);
    setIsLoading(false);
  };

  const generateCards = (pairs, theme) => {
    // Logique de génération des cartes selon le thème
    const cardValues = getCardValues(theme, pairs);
    const allCards = [...cardValues, ...cardValues];
    
    return allCards
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }));
  };

  const getCardValues = (theme, pairs) => {
    // Valeurs selon le thème (à étendre)
    const themes = {
      animaux: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄', '🐙', '🦉', '🦋'],
      fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🥝', '🥭', '🍍', '🍒', '🍉', '🍐', '🍈', '🍋', '🍏', '🥥', '🍅', '🍆'],
      emojis: ['😀', '😍', '🤔', '😎', '🤗', '😴', '🤩', '😋', '😱', '😡', '😭', '😇', '😜', '😬', '😅', '😏', '😃', '😈']
    };
    if (theme === 'chiffres') {
      return Array.from({ length: pairs }, (_, i) => (i + 1).toString());
    }
    return themes[theme]?.slice(0, pairs) || themes.animaux.slice(0, pairs);
  };

  const handleCardClick = (cardId) => {
    if (isBlocked || flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Retourner la carte
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Vérifier si on a une paire
    if (newFlippedCards.length === 2) {
      setIsBlocked(true);
      setMoveCount(prev => prev + 1);
      // Incrémenter le compteur du joueur actif
      setPlayerMoves(prev => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1
      }));
      setTimeout(() => {
        checkForMatch(newFlippedCards);
        setIsBlocked(false);
      }, 1000);
    }
  };

  const checkForMatch = (flippedCardIds) => {
    const [card1, card2] = flippedCardIds;
    const card1Value = cards[card1].value;
    const card2Value = cards[card2].value;

    if (card1Value === card2Value) {
      // Match trouvé
      setMatchedPairs(prev => [...prev, card1Value]);
      setCards(prev => prev.map(card => 
        flippedCardIds.includes(card.id) ? { ...card, isMatched: true } : card
      ));
      
      // Mettre à jour le score
      if (playerCount === 1) {
        setScores(prev => ({ ...prev, 1: prev[1] + 1 }));
      } else {
        setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
        setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      }
    } else {
      // Pas de match, retourner les cartes
      setCards(prev => prev.map(card => 
        flippedCardIds.includes(card.id) ? { ...card, isFlipped: false } : card
      ));
    }

    setFlippedCards([]);
  };

  // Vérifier si le jeu est terminé
  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      setIsGameComplete(true);
    }
  }, [matchedPairs, cards.length]);

  const handleNewGame = () => {
    navigate('/', { state: { gameParams } });
  };

  const handleQuitGame = () => {
    navigate('/');
  };

  // Gestion du focus clavier
  const cardRefs = React.useRef([]);

  // Activation clavier (Entrée/Espace)
  const handleCardKeyDown = (e, cardId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(cardId);
    }
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading">Chargement du jeu...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* En-tête du jeu */}
      <div className="game-header">
        <div className="game-info">
          <h1>Jeu de Mémoire</h1>
          <div className="game-stats">
            <span>Temps: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
            <span>Coups: {moveCount}</span>
            {playerCount === 1 ? (
              <span>Score: {scores[1]}</span>
            ) : (
              <div className="player-scores">
                <span className={currentPlayer === 1 ? 'active' : ''}>Joueur 1: {scores[1]}</span>
                <span className={currentPlayer === 2 ? 'active' : ''}>Joueur 2: {scores[2]}</span>
              </div>
            )}
          </div>
        </div>
        <div className="game-actions">
          <button onClick={handleNewGame} className="btn btn-secondary">Nouvelle Partie</button>
          <button onClick={handleQuitGame} className="btn btn-danger">Quitter</button>
        </div>
      </div>

      {/* Grille de cartes */}
      <div
        className={`game-grid grid-size-${gridSize}`}
        role="grid"
        aria-label="Grille de jeu de mémoire"
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
            tabIndex={card.isMatched ? -1 : 0}
            ref={el => cardRefs.current[idx] = el}
            onKeyDown={e => handleCardKeyDown(e, card.id)}
            role="gridcell"
            aria-label={card.isMatched ? `Carte trouvée` : card.isFlipped ? `Carte retournée` : `Carte face cachée`}
            aria-pressed={card.isFlipped}
            aria-disabled={card.isMatched}
            style={{ outline: card.isMatched ? 'none' : undefined }}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className={`card-back${theme === 'chiffres' ? ' chiffre' : ''}`}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de fin de jeu */}
      {isGameComplete && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Partie terminée !</h2>
            <div className="final-stats">
              <p>Temps total: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</p>
              <p>Nombre de coups: {moveCount}</p>
              {playerCount === 1 ? (
                <p>Score final: {scores[1]}</p>
              ) : (
                <div>
                  <p>Joueur 1: {scores[1]} points</p>
                  <p>Joueur 2: {scores[2]} points</p>
                  <p>Gagnant: {scores[1] > scores[2] ? 'Joueur 1' : scores[2] > scores[1] ? 'Joueur 2' : 'Égalité'}</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => navigate('/results', { state: { gameData: { scores, gameTime, playerCount, theme, gridSize, moveCount, playerMoves } } })} className="btn btn-primary">
                Voir les résultats
              </button>
              <button onClick={handleNewGame} className="btn btn-secondary">
                Nouvelle partie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game; 