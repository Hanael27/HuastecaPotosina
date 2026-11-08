export default function MusicRow({ cancion, index }) {
  return (
    <tr className="music-table__row">
      <td>{index + 1}</td>
      <td>
        <strong>{cancion.titulo}</strong>
        <br />
        <small className="music-table__artist">{cancion.artista}</small>
      </td>
      <td>
        <a
          className="music-table__link"
          href={cancion.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver en YouTube: ${cancion.titulo}, ${cancion.artista} (se abre en una pestaña nueva)`}
        >
          <i className="fab fa-youtube" aria-hidden="true" /> Ver en YouTube
        </a>
      </td>
    </tr>
  );
}
