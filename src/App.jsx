import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

const PAGE_TITLES = {
  '/': 'Huasteca Potosina — Maravilla Natural de México',
  '/historia': 'Historia | Huasteca Potosina',
  '/gastronomia': 'Gastronomía | Huasteca Potosina',
  '/musica': 'Música | Huasteca Potosina',
  '/cultura': 'Cultura | Huasteca Potosina',
  '/galeria': 'Galería | Huasteca Potosina',
  '/contacto': 'Contacto | Huasteca Potosina',
};

function App() {
  const { pathname } = useLocation();

  // Cada ruta tiene su propio <title>, para que lectores de pantalla y pestañas sepan dónde estás.
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'Página no encontrada | Huasteca Potosina';
  }, [pathname]);

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal
      </a>

      <WelcomeOverlay />

      <Header />
      <Nav />

      <main id="contenido-principal" className="main-content container-fluid" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/musica" element={<Musica />} />
          <Route path="/cultura" element={<Cultura />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <FlyingBird />
      <Footer />
    </>
  );
}

export default App;
