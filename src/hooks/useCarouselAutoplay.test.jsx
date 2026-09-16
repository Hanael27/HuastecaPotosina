jest.mock('../services/pixabayApi');
jest.mock('../assets/tourImageMap');

import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import galleryReducer from '../store/gallerySlice';
import useCarouselAutoplay from './useCarouselAutoplay';

const threeItems = [
  { id: 'a', nombre: 'A', imageUrl: 'a.jpg' },
  { id: 'b', nombre: 'B', imageUrl: 'b.jpg' },
  { id: 'c', nombre: 'C', imageUrl: 'c.jpg' },
];

function makeStore(preloadedGallery) {
  return configureStore({
    reducer: { gallery: galleryReducer },
    preloadedState: {
      gallery: {
        items: threeItems,
        status: 'succeeded',
        error: null,
        source: 'local',
        currentIndex: 0,
        isPlaying: true,
        ...preloadedGallery,
      },
    },
  });
}

function wrapperFor(store) {
  // eslint-disable-next-line react/display-name
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('advances the slide automatically while playing', () => {
  const store = makeStore({ isPlaying: true });

  renderHook(() => useCarouselAutoplay(1000), { wrapper: wrapperFor(store) });

  expect(store.getState().gallery.currentIndex).toBe(0);

  act(() => { jest.advanceTimersByTime(1000); });
  expect(store.getState().gallery.currentIndex).toBe(1);

  act(() => { jest.advanceTimersByTime(1000); });
  expect(store.getState().gallery.currentIndex).toBe(2);

  // wraps back to the start
  act(() => { jest.advanceTimersByTime(1000); });
  expect(store.getState().gallery.currentIndex).toBe(0);
});

test('does not advance while paused', () => {
  const store = makeStore({ isPlaying: false });

  renderHook(() => useCarouselAutoplay(1000), { wrapper: wrapperFor(store) });

  act(() => { jest.advanceTimersByTime(5000); });
  expect(store.getState().gallery.currentIndex).toBe(0);
});

test('does not schedule a timer when there is one or fewer items', () => {
  const store = makeStore({ items: [threeItems[0]], isPlaying: true });

  renderHook(() => useCarouselAutoplay(1000), { wrapper: wrapperFor(store) });

  act(() => { jest.advanceTimersByTime(5000); });
  expect(store.getState().gallery.currentIndex).toBe(0);
});
