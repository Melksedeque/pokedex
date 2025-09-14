import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from './index';

describe('Loading Component', () => {
  it('renders with default props', () => {
    render(<Loading />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByAltText('Pokémon Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Pokéball')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const customMessage = 'Buscando Pokémon...';
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { container } = render(<Loading size="large" />);
    
    expect(container.firstChild).toHaveClass('large');
  });

  it('applies default medium size when no size is provided', () => {
    const { container } = render(<Loading />);
    
    expect(container.firstChild).toHaveClass('medium');
  });

  it('renders all required elements', () => {
    render(<Loading />);
    
    // Verifica se todos os elementos estão presentes
    expect(screen.getByAltText('Pokémon Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Pokéball')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    
    // Verifica se a barra de progresso está presente
    const progressBar = document.querySelector('.progressBar');
    expect(progressBar).toBeInTheDocument();
    
    const progressFill = document.querySelector('.progressFill');
    expect(progressFill).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Loading />);
    
    const pokemonLogo = screen.getByAltText('Pokémon Logo');
    const pokeball = screen.getByAltText('Pokéball');
    
    expect(pokemonLogo).toHaveAttribute('alt', 'Pokémon Logo');
    expect(pokeball).toHaveAttribute('alt', 'Pokéball');
  });

  it('renders with small size correctly', () => {
    const { container } = render(<Loading size="small" message="Carregando rápido..." />);
    
    expect(container.firstChild).toHaveClass('small');
    expect(screen.getByText('Carregando rápido...')).toBeInTheDocument();
  });
});