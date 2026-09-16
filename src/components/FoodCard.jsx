import { useState } from 'react';
import comidaImages from '../assets/comidaImageMap';

function resolveImage(filename) {
  const match = Object.entries(comidaImages).find(([path]) => path.endsWith(filename));
  return match ? match[1] : null;
}

export default function FoodCard({ platillo }) {
  const resolvedSrc = resolveImage(platillo.imagen);
  const [imageFailed, setImageFailed] = useState(!resolvedSrc);

  return (
    <article className="food-card">
      <div className="food-card__image-wrap">
        {!imageFailed ? (
          <img
            src={resolvedSrc}
            alt={platillo.nombre}
            className="food-card__image"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="img-placeholder">
            <i className="fa-solid fa-image" aria-hidden="true" />
            <span>{platillo.nombre}</span>
          </div>
        )}
      </div>

      <div className="food-card__body">
        <h3 className="food-card__name">{platillo.nombre}</h3>
        <p className="food-card__desc">{platillo.descripcion}</p>
      </div>
    </article>
  );
}
