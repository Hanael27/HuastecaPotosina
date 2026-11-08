jest.mock('../services/pixabayApi');
jest.mock('../assets/tourImageMap');

import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import { hasPixabayKey } from '../services/pixabayApi';
import Galeria from './Galeria';

const galleryState = (source, itemSources = [source]) => ({
  gallery: {
    items: itemSources.map((itemSource, i) => ({
      id: `destino-${i}`,
      nombre: `Destino ${i}`,
      info: 'Info',
      imageUrl: `img${i}.jpg`,
      source: itemSource,
    })),
    status: 'succeeded',
    error: null,
    source,
    currentIndex: 0,
    isPlaying: false,
  },
});

test('tells the user how to configure the key when there is none', () => {
  hasPixabayKey.mockReturnValue(false);
  renderWithProviders(<Galeria />, { preloadedState: galleryState('local') });

  expect(screen.getByText(/configura vite_pixabay_api_key/i)).toBeInTheDocument();
});

test('does not ask for the key when it is set but Pixabay failed or returned nothing', () => {
  hasPixabayKey.mockReturnValue(true);
  renderWithProviders(<Galeria />, { preloadedState: galleryState('local') });

  expect(screen.getByText(/no se pudieron obtener imágenes de pixabay/i)).toBeInTheDocument();
  expect(screen.queryByText(/configura vite_pixabay_api_key/i)).not.toBeInTheDocument();
});

test('shows the live source note and the English credit when images come from Pixabay', () => {
  hasPixabayKey.mockReturnValue(true);
  renderWithProviders(<Galeria />, { preloadedState: galleryState('pixabay') });

  expect(screen.getByText(/obtenidas en tiempo real/i)).toBeInTheDocument();
  expect(screen.getByText(/images courtesy of pixabay/i)).toHaveAttribute('lang', 'en');
});

test('explains that some images are local when Pixabay had no reliable photo for every destination', () => {
  hasPixabayKey.mockReturnValue(true);
  renderWithProviders(<Galeria />, {
    preloadedState: galleryState('pixabay', ['pixabay', 'local']),
  });

  expect(screen.getByText(/algunas imágenes vienen de pixabay/i)).toBeInTheDocument();
});
