import { Link, useLocation } from 'react-router-dom';
import '/styles/Layout.css';

function Layout({ children }) {
  const location = useLocation();
  return (
    <div>
      <nav className="menu-bar">
        <Link to="/" className={`menu-link${location.pathname === '/' ? ' active' : ''}`}>Accueil</Link>
        <Link to="/game" className={`menu-link${location.pathname === '/game' ? ' active' : ''}`}>Jeu</Link>
        <Link to="/results" className={`menu-link${location.pathname === '/results' ? ' active' : ''}`}>Résultats</Link>
        <Link to="/top10" className={`menu-link${location.pathname === '/top10' ? ' active' : ''}`}>Top 10</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout; 