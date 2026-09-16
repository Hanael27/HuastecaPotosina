export default function CultureBlock({ bloque }) {
  return (
    <div className="culture-block">
      <h3 className="culture-block__title">
        <i className={`fa-solid ${bloque.icono}`} aria-hidden="true" /> {bloque.titulo}
      </h3>
      <p className="culture-block__text">{bloque.texto}</p>
    </div>
  );
}
