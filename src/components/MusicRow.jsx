export default function MusicRow({ cancion, index }) {
  return (
    <tr className="music-table__row">
      <td>{index + 1}</td>
      <td>
        <strong>{cancion.titulo}</strong>
        <br />
        <small style={{ color: '#777' }}>{cancion.artista}</small>
      </td>
      <td>
        <a
          className="music-table__link"
          href={cancion.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-youtube" aria-hidden="true" /> Ver en YouTube
        </a>
      </td>
    </tr>
  );
}
