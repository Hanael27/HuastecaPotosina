import { useDispatch, useSelector } from 'react-redux';
import {
  selectGallery,
  nextSlide,
  prevSlide,
  goToSlide,
  toggleAutoplay,
} from '../store/gallerySlice';
import useCarouselAutoplay from '../hooks/useCarouselAutoplay';

export default function Carousel({ intervalMs = 4000 }) {
  const dispatch = useDispatch();
  const { items, currentIndex, isPlaying } = useSelector(selectGallery);

  // El autoplay vive en su propio hook, testeado por separado.
  useCarouselAutoplay(intervalMs);

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    // role="region" + aria-label: el carrusel se anuncia como una región con nombre.
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de destinos de la Huasteca Potosina"
    >
      {/* Mientras avanza solo no se anuncia cada cambio; en pausa sí. */}
      <div className="carousel__viewport" aria-live={isPlaying ? 'off' : 'polite'}>
        {items.map((item, index) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${items.length}`}
            aria-hidden={index !== currentIndex}
            className={`carousel__slide ${
              index === currentIndex ? 'carousel__slide--active' : ''
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.alt || item.nombre}
              className="carousel__image"
            />
            <div className="carousel__caption">
              <h3 className="carousel__caption-title">{item.nombre}</h3>
              <p className="carousel__caption-text">{item.info}</p>
            </div>
          </div>
        ))}

        <div className="carousel__controls">
          <button
            type="button"
            className="carousel__arrow"
            aria-label="Imagen anterior"
            onClick={() => dispatch(prevSlide())}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="carousel__arrow"
            aria-label="Siguiente imagen"
            onClick={() => dispatch(nextSlide())}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="carousel__bottom-bar">
        <button
          type="button"
          className="carousel__play-toggle"
          aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
          onClick={() => dispatch(toggleAutoplay())}
        >
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} aria-hidden="true" />
        </button>

        {/* Son botones normales (no tabs): no hay tabpanels asociados. */}
        <div className="carousel__dots" role="group" aria-label="Seleccionar destino">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-current={index === currentIndex ? 'true' : undefined}
              aria-label={`Ir a ${item.nombre}`}
              className={`carousel__dot ${
                index === currentIndex ? 'carousel__dot--active' : ''
              }`}
              onClick={() => dispatch(goToSlide(index))}
            />
          ))}
        </div>
      </div>

      <span data-testid="carousel-current-label" style={{ display: 'none' }}>
        {current.nombre}
      </span>
    </div>
  );
}
