import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchImages, hasPixabayKey } from '../services/pixabayApi';
import siteData from '../data/siteData.json';
import localTourImages from '../assets/tourImageMap';

function buildLocalFallback() {
  return siteData.destinos.map((destino) => {
    const match = Object.entries(localTourImages).find(([path]) =>
      path.endsWith(destino.imagenLocal)
    );
    return {
      id: destino.id,
      nombre: destino.nombre,
      info: destino.info,
      alt: destino.alt,
      imageUrl: match ? match[1] : null,
      source: 'local',
    };
  });
}

// Cuántas fotos pide a Pixabay por destino para poder elegir una que sí sea del lugar.
const PIXABAY_CANDIDATES = 50;

// Pixabay ordena por popularidad, no por lugar: una foto solo se acepta si sus
// etiquetas (tags) mencionan alguna de las palabras clave del destino.
function matchesDestination(image, destino) {
  const tags = (image.tags || '').toLowerCase();
  return destino.palabrasClave.some((palabra) => tags.includes(palabra.toLowerCase()));
}

/**
 * Thunk asíncrono: para cada destino de la Huasteca, pide a la API de
 * Pixabay (vía Axios) fotos candidatas y elige la primera cuyas etiquetas
 * correspondan al lugar. Si no hay API key, si la petición falla o si
 * Pixabay no tiene una foto fiable de ese destino, esa diapositiva usa la
 * imagen local, para que la galería nunca quede vacía ni muestre otro lugar.
 */
export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetchGalleryImages',
  async () => {
    const localItems = buildLocalFallback();

    if (!hasPixabayKey()) {
      return { items: localItems, source: 'local' };
    }

    try {
      const items = await Promise.all(
        siteData.destinos.map(async (destino, index) => {
          const images = await searchImages(destino.busqueda, PIXABAY_CANDIDATES);
          const best = images.find((image) => matchesDestination(image, destino));
          if (!best) return localItems[index];

          return {
            id: destino.id,
            nombre: destino.nombre,
            info: destino.info,
            alt: `Fotografía de ${destino.nombre}`,
            imageUrl: best.imageUrl,
            attribution: best.user,
            source: 'pixabay',
          };
        })
      );

      const usesPixabay = items.some((item) => item.source === 'pixabay');
      return { items, source: usesPixabay ? 'pixabay' : 'local' };
    } catch {
      // Sin internet, key inválida o límite de peticiones: la galería no se
      // queda vacía, se muestran las imágenes locales (igual que sin key).
      return { items: localItems, source: 'local' };
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  source: null, // 'pixabay' | 'local'
  currentIndex: 0,
  isPlaying: true,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    nextSlide(state) {
      if (state.items.length === 0) return;
      state.currentIndex = (state.currentIndex + 1) % state.items.length;
    },
    prevSlide(state) {
      if (state.items.length === 0) return;
      state.currentIndex =
        (state.currentIndex - 1 + state.items.length) % state.items.length;
    },
    goToSlide(state, action) {
      const index = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.currentIndex = index;
      }
    },
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    toggleAutoplay(state) {
      state.isPlaying = !state.isPlaying;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryImages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items.filter((item) => item.imageUrl);
        state.source = action.payload.source;
        state.currentIndex = 0;
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { nextSlide, prevSlide, goToSlide, play, pause, toggleAutoplay } =
  gallerySlice.actions;

export const selectGallery = (state) => state.gallery;

export default gallerySlice.reducer;
