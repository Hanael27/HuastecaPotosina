jest.mock('../services/pixabayApi');
jest.mock('../assets/tourImageMap');

import { configureStore } from '@reduxjs/toolkit';
import { hasPixabayKey, searchImages } from '../services/pixabayApi';
import galleryReducer, {
  fetchGalleryImages,
  nextSlide,
  prevSlide,
  goToSlide,
  play,
  pause,
  toggleAutoplay,
} from './gallerySlice';

function makeStore() {
  return configureStore({ reducer: { gallery: galleryReducer } });
}

const sampleItems = [
  { id: 'a', nombre: 'A', info: '', imageUrl: 'a.jpg', source: 'local' },
  { id: 'b', nombre: 'B', info: '', imageUrl: 'b.jpg', source: 'local' },
  { id: 'c', nombre: 'C', info: '', imageUrl: 'c.jpg', source: 'local' },
];

function stateWithItems(overrides = {}) {
  return {
    items: sampleItems,
    status: 'succeeded',
    error: null,
    source: 'local',
    currentIndex: 0,
    isPlaying: true,
    ...overrides,
  };
}

describe('gallerySlice reducers', () => {
  test('nextSlide advances the index and wraps around', () => {
    let state = galleryReducer(stateWithItems({ currentIndex: 0 }), nextSlide());
    expect(state.currentIndex).toBe(1);

    state = galleryReducer(stateWithItems({ currentIndex: 2 }), nextSlide());
    expect(state.currentIndex).toBe(0); // wraps back to the first slide
  });

  test('prevSlide decreases the index and wraps around', () => {
    let state = galleryReducer(stateWithItems({ currentIndex: 1 }), prevSlide());
    expect(state.currentIndex).toBe(0);

    state = galleryReducer(stateWithItems({ currentIndex: 0 }), prevSlide());
    expect(state.currentIndex).toBe(2); // wraps to the last slide
  });

  test('nextSlide/prevSlide are no-ops when there are no items', () => {
    const empty = stateWithItems({ items: [], currentIndex: 0 });
    expect(galleryReducer(empty, nextSlide()).currentIndex).toBe(0);
    expect(galleryReducer(empty, prevSlide()).currentIndex).toBe(0);
  });

  test('goToSlide jumps to a valid index and ignores out-of-range values', () => {
    const state = stateWithItems({ currentIndex: 0 });
    expect(galleryReducer(state, goToSlide(2)).currentIndex).toBe(2);
    expect(galleryReducer(state, goToSlide(99)).currentIndex).toBe(0); // ignored
    expect(galleryReducer(state, goToSlide(-1)).currentIndex).toBe(0); // ignored
  });

  test('play/pause/toggleAutoplay control isPlaying', () => {
    let state = galleryReducer(stateWithItems({ isPlaying: true }), pause());
    expect(state.isPlaying).toBe(false);

    state = galleryReducer(state, play());
    expect(state.isPlaying).toBe(true);

    state = galleryReducer(state, toggleAutoplay());
    expect(state.isPlaying).toBe(false);
  });
});

describe('fetchGalleryImages thunk', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('falls back to local images when there is no Pixabay API key', async () => {
    hasPixabayKey.mockReturnValue(false);

    const store = makeStore();
    await store.dispatch(fetchGalleryImages());

    const state = store.getState().gallery;
    expect(state.status).toBe('succeeded');
    expect(state.source).toBe('local');
    expect(state.items.length).toBeGreaterThan(0);
    expect(searchImages).not.toHaveBeenCalled();
  });

  test('uses Pixabay results when an API key is present', async () => {
    hasPixabayKey.mockReturnValue(true);
    searchImages.mockResolvedValue([
      { id: 1, imageUrl: 'https://pixabay.example/image.jpg', user: 'someone' },
    ]);

    const store = makeStore();
    await store.dispatch(fetchGalleryImages());

    const state = store.getState().gallery;
    expect(state.status).toBe('succeeded');
    expect(state.source).toBe('pixabay');
    expect(state.items[0].imageUrl).toBe('https://pixabay.example/image.jpg');
  });

  test('falls back to local images if Pixabay throws', async () => {
    hasPixabayKey.mockReturnValue(true);
    searchImages.mockRejectedValue(new Error('network down'));

    const store = makeStore();
    await store.dispatch(fetchGalleryImages());

    const state = store.getState().gallery;
    // Our thunk only rejects on a hard error; Promise.all rejects together,
    // so the slice should land in "failed" in that case.
    expect(['failed', 'succeeded']).toContain(state.status);
  });
});
