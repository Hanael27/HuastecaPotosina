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
      imageUrl: match ? match[1] : null,
      source: 'local',
    };
  });
}

/**
 * Thunk asíncrono: para cada destino de la Huasteca, pide a la API de
 * Pixabay (vía Axios) una imagen representativa. Si no hay API key
 * configurada, o si la petición falla, se usa el set de imágenes
 * locales como respaldo, para que la galería nunca quede vacía.
 */
export const fetchGalleryImages = createAsyncThunk(
  'gallery/fetchGalleryImages',
  async (_, { rejectWithValue }) => {
    if (!hasPixabayKey()) {
      return { items: buildLocalFallback(), source: 'local' };
    }

    try {
      const results = await Promise.all(
        siteData.destinos.map(async (destino) => {
          const images = await searchImages(destino.busqueda, 3);
          const best = images[0];
          return {
            id: destino.id,
            nombre: destino.nombre,
            info: destino.info,
            imageUrl: best ? best.imageUrl : null,
            attribution: best ? best.user : null,
            source: 'pixabay',
          };
        })
      );

      // Si Pixabay no regresó ninguna imagen usable, cae al respaldo local
      const usable = results.filter((r) => r.imageUrl);
      if (usable.length === 0) {
        return { items: buildLocalFallback(), source: 'local' };
      }
      return { items: results, source: 'pixabay' };
    } catch (err) {
      return rejectWithValue(err.message || 'Error al conectar con Pixabay');
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
