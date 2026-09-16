import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextSlide, selectGallery } from '../store/gallerySlice';

/**
 * Hook que hace avanzar el carrusel automáticamente cada `intervalMs`
 * milisegundos, mientras `isPlaying` sea true y haya más de una imagen.
 * Se pausa automáticamente si el usuario navega manualmente y reactiva
 * el autoplay, o si `isPlaying` se pone en false desde afuera (botón pausa).
 */
export default function useCarouselAutoplay(intervalMs = 4000) {
  const dispatch = useDispatch();
  const { items, isPlaying } = useSelector(selectGallery);

  useEffect(() => {
    if (!isPlaying || items.length <= 1) return undefined;

    const id = setInterval(() => {
      dispatch(nextSlide());
    }, intervalMs);

    return () => clearInterval(id);
  }, [dispatch, isPlaying, items.length, intervalMs]);
}
