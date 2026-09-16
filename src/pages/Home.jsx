import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSitio } from '../store/contentSlice';

const tiles = [
  { to: '/historia', label: 'Historia', icon: 'fa-landmark' },
  { to: '/gastronomia', label: 'Gastronomía', icon: 'fa-bowl-food' },
  { to: '/musica', label: 'Música', icon: 'fa-music' },
  { to: '/cultura', label: 'Cultura', icon: 'fa-masks-theater' },
  { to: '/galeria', label: 'Galería', icon: 'fa-images' },
];

export default function Home() {
  const sitio = useSelector(selectSitio);

  return (
    <section className="section" aria-labelledby="title-home">
      <div className="section__header">
        <h2 className="section__title" id="title-home">
          Bienvenido
        </h2>
        <i className="fa-solid fa-compass section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p>{sitio.descripcionBreve}</p>
        <p>Elige una sección para comenzar tu recorrido por la Huasteca Potosina:</p>

        <div className="culture-grid" style={{ marginTop: '1.5rem' }}>
          {tiles.map((tile) => (
            <Link key={tile.to} to={tile.to} className="culture-block">
              <h3 className="culture-block__title">
                <i className={`fa-solid ${tile.icon}`} aria-hidden="true" /> {tile.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
