import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div>
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/">Accueil</Link>
        <Link to="/game">Jeu</Link>
        <Link to="/results">Résultats</Link>
        <Link to="/top10">Top 10</Link>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}

export default Layout; 