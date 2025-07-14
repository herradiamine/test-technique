import '/styles/GridSizeSelector.css';

function GridSizeSelector({ size, onChange }) {
  return (
    <div className="grid-size-selector">
      <button
        className={`grid-btn${size === 'grille_4x4' ? ' selected' : ''}`}
        onClick={() => onChange('grille_4x4')}
        type="button"
      >
        4x4
      </button>
      <button
        className={`grid-btn${size === 'grille_6x6' ? ' selected' : ''}`}
        onClick={() => onChange('grille_6x6')}
        type="button"
      >
        6x6
      </button>
    </div>
  );
}

export default GridSizeSelector; 