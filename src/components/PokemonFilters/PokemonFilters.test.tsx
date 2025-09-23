import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonFilters, { FilterState } from './index';

describe('PokemonFilters', () => {
  const defaultFilters: FilterState = {
    types: [],
    numberRange: { min: 1, max: 1010 }
  };

  const defaultProps = {
    onFilterChange: jest.fn(),
    onSortChange: jest.fn(),
    onSearchChange: jest.fn(),
    currentFilters: defaultFilters,
    currentSort: { label: 'Número (Crescente)', value: 'id' as const },
    currentSearch: '',
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar os controles principais', () => {
    render(<PokemonFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Buscar Pokémon por nome...')).toBeInTheDocument();
    expect(screen.getByLabelText('Ordenar:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mostrar filtros' })).toBeInTheDocument();
  });

  it('deve expandir e recolher o painel de filtros', () => {
    render(<PokemonFilters {...defaultProps} />);
    
    const expandButton = screen.getByRole('button', { name: 'Mostrar filtros' });
    
    // Inicialmente recolhido
    expect(screen.queryByText('Número do Pokémon')).not.toBeInTheDocument();
    
    // Expandir
    fireEvent.click(expandButton);
    expect(screen.getByText('Número do Pokémon')).toBeInTheDocument();
    expect(screen.getByText('Tipos de Pokémon')).toBeInTheDocument();
    
    // Recolher
    fireEvent.click(expandButton);
    expect(screen.queryByText('Número do Pokémon')).not.toBeInTheDocument();
  });

  it('deve chamar onSearchChange com debounce', async () => {
    const onSearchChange = jest.fn();
    render(<PokemonFilters {...defaultProps} onSearchChange={onSearchChange} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar Pokémon por nome...');
    
    fireEvent.change(searchInput, { target: { value: 'pikachu' } });
    
    // Não deve chamar imediatamente
    expect(onSearchChange).not.toHaveBeenCalled();
    
    // Avançar o timer
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(onSearchChange).toHaveBeenCalledWith('pikachu');
    });
  });

  it('deve limpar a busca quando botão X é clicado', () => {
    render(<PokemonFilters {...defaultProps} currentSearch="pikachu" />);
    
    const clearButton = screen.getByLabelText('Limpar busca');
    fireEvent.click(clearButton);
    
    expect(screen.getByPlaceholderText('Buscar Pokémon por nome...')).toHaveValue('');
  });

  it('deve chamar onSortChange quando ordenação é alterada', () => {
    const onSortChange = jest.fn();
    render(<PokemonFilters {...defaultProps} onSortChange={onSortChange} />);
    
    const sortSelect = screen.getByDisplayValue('Número (Crescente)');
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    
    expect(onSortChange).toHaveBeenCalledWith('name');
  });

  it('deve filtrar por tipo de Pokémon', () => {
    const onFilterChange = jest.fn();
    render(<PokemonFilters {...defaultProps} onFilterChange={onFilterChange} />);
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Clicar no tipo fire
    const fireButton = screen.getByRole('button', { name: /fire/i });
    fireEvent.click(fireButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      types: ['fire'],
      numberRange: { min: 1, max: 1010 }
    });
  });

  it('deve remover tipo quando clicado novamente', () => {
    const onFilterChange = jest.fn();
    const filtersWithFire: FilterState = {
      types: ['fire'],
      numberRange: { min: 1, max: 1010 }
    };
    
    render(
      <PokemonFilters 
        {...defaultProps} 
        currentFilters={filtersWithFire}
        onFilterChange={onFilterChange} 
      />
    );
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Clicar no tipo fire novamente
    const fireButton = screen.getByRole('button', { name: /fire/i });
    fireEvent.click(fireButton);
    
    expect(onFilterChange).toHaveBeenCalledWith({
      types: [],
      numberRange: { min: 1, max: 1010 }
    });
  });

  it('deve filtrar por intervalo de números', () => {
    const onFilterChange = jest.fn();
    render(<PokemonFilters {...defaultProps} onFilterChange={onFilterChange} />);
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Alterar número mínimo
    const minInput = screen.getByLabelText('De:');
    fireEvent.change(minInput, { target: { value: '10' } });
    
    expect(onFilterChange).toHaveBeenCalledWith({
      types: [],
      numberRange: { min: 10, max: 1010 }
    });
    
    // Alterar número máximo
    const maxInput = screen.getByLabelText('Até:');
    fireEvent.change(maxInput, { target: { value: '150' } });
    
    expect(onFilterChange).toHaveBeenCalledWith({
      types: [],
      numberRange: { min: 10, max: 150 }
    });
  });

  it('deve mostrar botão "Limpar Filtros" quando há filtros ativos', () => {
    const filtersWithData: FilterState = {
      types: ['fire', 'water'],
      numberRange: { min: 10, max: 150 }
    };
    
    render(
      <PokemonFilters 
        {...defaultProps} 
        currentFilters={filtersWithData}
        currentSearch="pikachu"
      />
    );
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    expect(screen.getByText('Limpar Filtros')).toBeInTheDocument();
    expect(screen.getByText('2 tipos selecionados')).toBeInTheDocument();
  });

  it('deve limpar todos os filtros quando "Limpar Filtros" é clicado', () => {
    const onFilterChange = jest.fn();
    const onSearchChange = jest.fn();
    const onSortChange = jest.fn();
    
    const filtersWithData: FilterState = {
      types: ['fire', 'water'],
      numberRange: { min: 10, max: 150 }
    };
    
    render(
      <PokemonFilters 
        {...defaultProps}
        currentFilters={filtersWithData}
        currentSearch="pikachu"
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
      />
    );
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Limpar filtros
    fireEvent.click(screen.getByText('Limpar Filtros'));
    
    expect(onFilterChange).toHaveBeenCalledWith({
      types: [],
      numberRange: { min: 1, max: 1010 }
    });
    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(onSortChange).toHaveBeenCalledWith('id');
  });

  it('deve desabilitar controles quando isLoading é true', () => {
    render(<PokemonFilters {...defaultProps} isLoading={true} />);
    
    expect(screen.getByPlaceholderText('Buscar Pokémon por nome...')).toBeDisabled();
    expect(screen.getByDisplayValue('Número (Crescente)')).toBeDisabled();
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Verificar se inputs de número estão desabilitados
    expect(screen.getByLabelText('De:')).toBeDisabled();
    expect(screen.getByLabelText('Até:')).toBeDisabled();
    
    // Verificar se botões de tipo estão desabilitados
    const fireButton = screen.getByRole('button', { name: /fire/i });
    expect(fireButton).toBeDisabled();
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(<PokemonFilters {...defaultProps} />);
    
    const searchInput = screen.getByLabelText('Buscar Pokémon por nome');
    expect(searchInput).toBeInTheDocument();
    
    const expandButton = screen.getByRole('button', { name: 'Mostrar filtros' });
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    
    // Expandir
    fireEvent.click(expandButton);
    expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    
    // Verificar labels dos inputs
    expect(screen.getByLabelText('De:')).toBeInTheDocument();
    expect(screen.getByLabelText('Até:')).toBeInTheDocument();
  });

  it('deve lidar com valores inválidos nos inputs de número', () => {
    const onFilterChange = jest.fn();
    render(<PokemonFilters {...defaultProps} onFilterChange={onFilterChange} />);
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    // Limpar chamadas anteriores
    onFilterChange.mockClear();
    
    // Tentar inserir valor inválido
    const minInput = screen.getByLabelText('De:');
    fireEvent.change(minInput, { target: { value: 'abc' } });
    
    // Não deve chamar onFilterChange com valor inválido
    expect(onFilterChange).not.toHaveBeenCalled();
  });

  it('deve mostrar contagem correta de tipos selecionados', () => {
    const filtersWithOneType: FilterState = {
      types: ['fire'],
      numberRange: { min: 1, max: 1010 }
    };
    
    const { rerender } = render(
      <PokemonFilters 
        {...defaultProps} 
        currentFilters={filtersWithOneType}
      />
    );
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    expect(screen.getByText('1 tipo selecionado')).toBeInTheDocument();
    
    // Testar com múltiplos tipos
    const filtersWithMultipleTypes: FilterState = {
      types: ['fire', 'water', 'grass'],
      numberRange: { min: 1, max: 1010 }
    };
    
    rerender(
      <PokemonFilters 
        {...defaultProps} 
        currentFilters={filtersWithMultipleTypes}
      />
    );
    
    expect(screen.getByText('3 tipos selecionados')).toBeInTheDocument();
  });

  it('deve aplicar estilos corretos para tipos ativos', () => {
    const filtersWithTypes: FilterState = {
      types: ['fire', 'water'],
      numberRange: { min: 1, max: 1010 }
    };
    
    render(
      <PokemonFilters 
        {...defaultProps} 
        currentFilters={filtersWithTypes}
      />
    );
    
    // Expandir filtros
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar filtros' }));
    
    const fireButton = screen.getByRole('button', { name: /fire/i });
    const waterButton = screen.getByRole('button', { name: /water/i });
    const grassButton = screen.getByRole('button', { name: /grass/i });
    
    expect(fireButton).toHaveAttribute('aria-pressed', 'true');
    expect(waterButton).toHaveAttribute('aria-pressed', 'true');
    expect(grassButton).toHaveAttribute('aria-pressed', 'false');
  });
});