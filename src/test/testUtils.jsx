import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import contentReducer from '../store/contentSlice';
import galleryReducer from '../store/gallerySlice';
import uiReducer from '../store/uiSlice';

export function setupTestStore(preloadedState) {
  return configureStore({
    reducer: {
      content: contentReducer,
      gallery: galleryReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  { preloadedState, store = setupTestStore(preloadedState), route = '/' } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
