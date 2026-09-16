import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectMusica } from '../store/contentSlice';
import MusicRow from '../components/MusicRow';

export default function Musica() {
  const musica = useSelector(selectMusica);

  return (
    <section id="section-musica" className="section" aria-labelledby="title-musica">
      <div className="section__header">
        <h2 className="section__title" id="title-musica">
          Música
        </h2>
        <i className="fa-solid fa-guitar section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p className="section__description">{musica.descripcion}</p>

        <table className="music-table" aria-label="Lista de canciones huastecas">
          <thead className="music-table__head">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Canción / Artista</th>
              <th scope="col">Escuchar</th>
            </tr>
          </thead>
          <tbody>
            {musica.canciones.map((cancion, index) => (
              <MusicRow key={cancion.id} cancion={cancion} index={index} />
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
