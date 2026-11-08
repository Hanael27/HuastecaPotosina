import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalleryImages, selectGallery } from '../store/gallerySlice';
import { hasPixabayKey } from '../services/pixabayApi';
import Carousel from '../components/Carousel';

// Texto de la nota bajo el carrusel, según de dónde vienen las imágenes.
// hasPixabayKey() distingue dos casos que ambos terminan en imágenes locales:
//  - no hay API key configurada -> se le indica al usuario cómo configurarla
//  - sí hay key, pero Pixabay falló o no devolvió imágenes -> no tiene sentido pedirle la key
function getSourceNote(source, items) {
  if (source === 'pixabay') {
    // Si en algún destino Pixabay no tenía una foto fiable, esa usa la imagen local
    const allFromPixabay = items.every((item) => item.source === 'pixabay');
    return allFromPixabay
      ? 'Imágenes obtenidas en tiempo real desde la API pública de Pixabay.'
      : 'Algunas imágenes vienen de Pixabay; donde no se encontró una foto fiable del lugar se usa una imagen local.';
  }
  if (hasPixabayKey()) {
    return 'No se pudieron obtener imágenes de Pixabay por ahora, así que se muestran imágenes locales de respaldo.';
  }
  return 'Mostrando imágenes locales de respaldo. Configura VITE_PIXABAY_API_KEY en tu .env para traer imágenes en vivo desde Pixabay.';
}

export default function Galeria() {
  const dispatch = useDispatch();
  const { status, error, source, items } = useSelector(selectGallery);

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
          <div className="gallery-status" role="status">
            <div className="gallery-status__spinner" aria-hidden="true" />
            <p>Cargando imágenes...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="gallery-status" role="alert">
            <p>No se pudieron cargar las imágenes: {error}</p>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <Carousel intervalMs={4000} />
            <p className="gallery-source-note">
              {getSourceNote(source, items)}
            </p>
            {source === 'pixabay' && (
              <p className="gallery-source-note">
                <span lang="en">Images courtesy of Pixabay.</span>
              </p>
            )}
          </>
        )}
      </div>

      <Link to="/" className="section__back">
        <i className="fa-solid fa-arrow-up" aria-hidden="true" /> Volver al inicio
      </Link>
    </section>
  );
}
