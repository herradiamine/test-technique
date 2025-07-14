import '/styles/ThemeSelector.css';

function ThemeSelector({ theme, onChange }) {
  return (
    <div className="theme-selector">
      <button
        className={`theme-btn${theme === 'nombres' ? ' selected' : ''}`}
        onClick={() => onChange('nombres')}
        type="button"
      >
        Numbers
      </button>
      <button
        className={`theme-btn${theme === 'icônes' ? ' selected' : ''}`}
        onClick={() => onChange('icônes')}
        type="button"
      >
        Icons
      </button>
    </div>
  );
}

export default ThemeSelector; 