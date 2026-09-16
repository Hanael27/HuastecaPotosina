import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectHistoria } from '../store/contentSlice';

export default function Historia() {
  const historia = useSelector(selectHistoria);

  return (
    <section id="section-historia" className="section" aria-labelledby="title-historia">
      <div className="section__header">
        <h2 className="section__title" id="title-historia">
          Historia
        </h2>
        <i className="fa-solid fa-scroll section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        {historia.parrafos.map((parrafo, index) => (
          <p key={index}>{parrafo}</p>
        ))}
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
