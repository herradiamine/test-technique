import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Game from './pages/Game.jsx';
import Results from './pages/Results.jsx';
import Top10 from './pages/Top10.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/top10" element={<Top10 />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
