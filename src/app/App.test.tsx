import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('muestra el shell principal sin presentar resultados validados', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Calculadora Eléctrica Pro' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Perfil normativo pendiente de validación')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-navigation')).toHaveAccessibleName('Navegación principal');
  });

  it('permite crear un borrador local desde el CTA', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId('create-project'));
    await user.type(screen.getByLabelText('Nombre del proyecto'), 'Taller norte');
    await user.click(screen.getByRole('button', { name: 'Crear borrador' }));

    expect(screen.getByRole('heading', { level: 3, name: 'Taller norte' })).toBeInTheDocument();
    expect(screen.getByText('Ubicación por definir')).toBeInTheDocument();
  });
});
