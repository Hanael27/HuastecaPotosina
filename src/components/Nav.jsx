import { NavLink } from 'react-router-dom';

const links = [
  { to: '/historia', label: 'Historia', icon: 'fa-landmark' },
  { to: '/gastronomia', label: 'Gastronomía', icon: 'fa-bowl-food' },
  { to: '/musica', label: 'Música', icon: 'fa-music' },
  { to: '/cultura', label: 'Cultura', icon: 'fa-masks-theater' },
];

export default function Nav() {
  return (
    <nav className="nav" aria-label="Navegación principal">
      <ul className="nav__list">
        {links.map((link) => (
          <li className="nav__item" key={link.to}>
            <NavLink to={link.to} className="nav__link">
              <i className={`fa-solid ${link.icon}`} aria-hidden="true" /> {link.label}
            </NavLink>
          </li>
        ))}

        {/* Antes abría el mapa interactivo (Quest); ahora lleva a la
            galería de imágenes con datos de la API de Pixabay. */}
        <li className="nav__item">
          <NavLink to="/galeria" className="nav__link nav__link--gallery">
            <i className="fa-solid fa-images" aria-hidden="true" /> Galería
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
