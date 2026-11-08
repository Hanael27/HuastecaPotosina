import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contacto from './Contacto';

// Contacto no usa Redux: solo necesita el router (por el enlace "Volver al inicio").
const renderContacto = () =>
  render(
    <MemoryRouter>
      <Contacto />
    </MemoryRouter>
  );

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Ana López' } });
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
    target: { value: 'ana@correo.com' },
  });
  fireEvent.change(screen.getByLabelText(/asunto/i), { target: { value: 'rutas' } });
  fireEvent.change(screen.getByLabelText(/^mensaje/i), {
    target: { value: 'Quiero conocer las cascadas de Tamasopo.' },
  });
  fireEvent.click(screen.getByLabelText(/acepto que usen mis datos/i));
}

test('every field is associated with its label', () => {
  renderContacto();

  expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute('id', 'contacto-nombre');
  expect(screen.getByLabelText(/correo electrónico/i)).toHaveAttribute('type', 'email');
  expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^mensaje/i)).toBeInTheDocument();
  expect(screen.getByRole('group', { name: /temas que te interesan/i })).toBeInTheDocument();
});

test('shows an error summary and marks invalid fields when submitting an empty form', () => {
  renderContacto();

  fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/5 campos por corregir/i);
  expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Escribe tu nombre.', { selector: 'p' })).toBeInTheDocument();
});

test('rejects an email without a valid format', () => {
  renderContacto();

  fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@' } });
  fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

  expect(screen.getByText(/formato nombre@dominio.com/i, { selector: 'p' })).toBeInTheDocument();
});

test('shows a confirmation message when the form is valid', () => {
  renderContacto();

  fillValidForm();
  fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

  expect(screen.getByRole('status')).toHaveTextContent(/mensaje enviado/i);
  expect(screen.getByRole('status')).toHaveTextContent('Ana López');
});
