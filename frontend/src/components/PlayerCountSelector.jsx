import '/styles/PlayerCountSelector.css';

function PlayerCountSelector({ count, onChange }) {
  return (
    <div className="player-count-selector">
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          className={`player-btn${count === n ? ' selected' : ''}`}
          onClick={() => onChange(n)}
          type="button"
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default PlayerCountSelector; 