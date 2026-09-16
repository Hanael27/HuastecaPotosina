import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">Página no encontrada</h2>
        <i className="fa-solid fa-compass section__icon" aria-hidden="true" />
      </div>
      <div className="section__body">
        <p>La página que buscas no existe.</p>
      </div>
      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
