jest.mock('../assets/comidaImageMap');

import { render, screen, fireEvent } from '@testing-library/react';
import FoodCard from './FoodCard';

const platillo = {
  id: 'zacahuil',
  nombre: 'Zacahuil',
  descripcion: 'El tamal gigante de la Huasteca.',
  imagen: 'Zacahuil.jpg',
};

test('renders the dish name and description', () => {
  render(<FoodCard platillo={platillo} />);

  expect(screen.getByText('Zacahuil')).toBeInTheDocument();
  expect(screen.getByText(/tamal gigante/i)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Zacahuil' })).toBeInTheDocument();
});

test('shows a placeholder if the image fails to load', () => {
  render(<FoodCard platillo={platillo} />);

  const img = screen.getByRole('img', { name: 'Zacahuil' });
  fireEvent.error(img);

  expect(screen.queryByRole('img', { name: 'Zacahuil' })).not.toBeInTheDocument();
  expect(screen.getByText('Zacahuil', { selector: 'span' })).toBeInTheDocument(); // still shown in the placeholder
});

test('shows a placeholder immediately when no local image matches', () => {
  render(
    <FoodCard
      platillo={{ ...platillo, imagen: 'NoExiste.jpg' }}
    />
  );

  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
