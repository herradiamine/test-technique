import '/styles/StartGameButton.css';

function StartGameButton({ disabled, onClick }) {
  return (
    <button className="start-game-btn" disabled={disabled} onClick={onClick} type="button">
      Start Game
    </button>
  );
}

export default StartGameButton; 