import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import FlyingBird from './components/FlyingBird';
import WelcomeOverlay from './components/WelcomeOverlay';
import Home from './pages/Home';
import Historia from './pages/Historia';
import Gastronomia from './pages/Gastronomia';
import Musica from './pages/Musica';
import Cultura from './pages/Cultura';
import Galeria from './pages/Galeria';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <WelcomeOverlay />

      <Header />
      <Nav />

      <main className="main-content container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/musica" element={<Musica />} />
          <Route path="/cultura" element={<Cultura />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <FlyingBird />
      <Footer />
    </>
  );
}

export default App;
