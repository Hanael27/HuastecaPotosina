import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCultura } from '../store/contentSlice';
import CultureBlock from '../components/CultureBlock';

export default function Cultura() {
  const cultura = useSelector(selectCultura);

  return (
    <section id="section-cultura" className="section" aria-labelledby="title-cultura">
      <div className="section__header">
        <h2 className="section__title" id="title-cultura">
          Cultura
        </h2>
        <i className="fa-solid fa-masks-theater section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p>
          La Huasteca Potosina es un mosaico cultural donde conviven tradiciones milenarias del
          pueblo teenek con la identidad mestiza de la región.
        </p>

        <div className="culture-grid">
          {cultura.bloques.map((bloque) => (
            <CultureBlock key={bloque.id} bloque={bloque} />
          ))}
        </div>
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
