jest.mock('../services/pixabayApi');
jest.mock('../assets/tourImageMap');

import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/testUtils';
import Carousel from './Carousel';

const preloadedState = {
  gallery: {
    items: [
      { id: 'xilitla', nombre: 'Xilitla', info: 'Las Pozas', imageUrl: 'xilitla.jpg' },
      { id: 'tamasopo', nombre: 'Tamasopo', info: 'Cascadas', imageUrl: 'tamasopo.jpg' },
    ],
    status: 'succeeded',
    error: null,
    source: 'local',
    currentIndex: 0,
    isPlaying: true,
  },
};

test('renders the active slide caption', () => {
  renderWithProviders(<Carousel />, { preloadedState });
  expect(screen.getByTestId('carousel-current-label')).toHaveTextContent('Xilitla');
});

test('advances to the next slide when clicking the next arrow', () => {
  renderWithProviders(<Carousel />, { preloadedState });

  fireEvent.click(screen.getByRole('button', { name: /siguiente imagen/i }));

  expect(screen.getByTestId('carousel-current-label')).toHaveTextContent('Tamasopo');
});

test('jumps to a slide when clicking its dot', () => {
  renderWithProviders(<Carousel />, { preloadedState });

  fireEvent.click(screen.getByRole('tab', { name: /ir a tamasopo/i }));

  expect(screen.getByTestId('carousel-current-label')).toHaveTextContent('Tamasopo');
});

test('toggles the play/pause button label', () => {
  renderWithProviders(<Carousel />, { preloadedState });

  const toggleBtn = screen.getByRole('button', { name: /pausar carrusel/i });
  fireEvent.click(toggleBtn);

  expect(screen.getByRole('button', { name: /reanudar carrusel/i })).toBeInTheDocument();
});

test('renders nothing when there are no items', () => {
  const { container } = renderWithProviders(<Carousel />, {
    preloadedState: { gallery: { ...preloadedState.gallery, items: [] } },
  });

  expect(container).toBeEmptyDOMElement();
});
