import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalleryImages, selectGallery } from '../store/gallerySlice';
import { hasPixabayKey } from '../services/pixabayApi';
import Carousel from '../components/Carousel';

export default function Galeria() {
  const dispatch = useDispatch();
  const { status, error, source } = useSelector(selectGallery);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGalleryImages());
    }
  }, [status, dispatch]);

  return (
    <section id="section-galeria" className="section" aria-labelledby="title-galeria">
      <div className="section__header">
        <h2 className="section__title" id="title-galeria">
          Galería
        </h2>
        <i className="fa-solid fa-images section__icon" aria-hidden="true" />
      </div>

      <div className="section__body">
        <p className="gallery-intro">
          Un recorrido visual por los destinos más impresionantes de la Huasteca Potosina. Las
          imágenes cambian automáticamente cada pocos segundos: usa las flechas, los puntos o el
          botón de pausa para controlarlo tú mismo.
        </p>

        {status === 'loading' && (
          <div className="gallery-status">
            <div className="gallery-status__spinner" aria-hidden="true" />
            <p>Cargando imágenes...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="gallery-status">
            <p>No se pudieron cargar las imágenes: {error}</p>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <Carousel intervalMs={4000} />
            <p className="gallery-source-note">
              {source === 'pixabay'
                ? 'Imágenes obtenidas en tiempo real desde la API pública de Pixabay.'
                : 'Mostrando imágenes locales de respaldo. Configura VITE_PIXABAY_API_KEY en tu .env para traer imágenes en vivo desde Pixabay.'}
            </p>
          </>
        )}
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
