import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGastronomia } from '../store/contentSlice';
import FoodCard from '../components/FoodCard';

export default function Gastronomia() {
  const gastronomia = useSelector(selectGastronomia);

  return (
    <section id="section-gastronomia" className="section" aria-labelledby="title-gastronomia">
      <div className="section__header">
        <h2 className="section__title" id="title-gastronomia">
          Gastronomía
        </h2>
        <i className="fa-solid fa-utensils section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p>
          La cocina huasteca es un patrimonio vivo de sabores prehispánicos y mestizos. Cada
          platillo cuenta la historia de un pueblo y su tierra.
        </p>

        <div className="food-grid">
          {gastronomia.platillos.map((platillo) => (
            <FoodCard key={platillo.id} platillo={platillo} />
          ))}
        </div>
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
