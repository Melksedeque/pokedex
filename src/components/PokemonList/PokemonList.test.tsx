import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonList from './index';
// import { PokemonApiService } from '../../services/pokemonApi';

// Mock do serviço da API
jest.mock('../../services/pokemonApi', () => ({
  __esModule: true,
  PokemonApiService: {
    getPokemonList: jest.fn(),
    getAllPokemon: jest.fn(),
    getPokemonDetails: jest.fn(),
    searchPokemonByName: jest.fn(),
    extractPokemonId: jest.fn(),
    getPokemonByType: jest.fn(),
    getPokemonSpecies: jest.fn()
  }
}));

const { PokemonApiService: mockPokemonApiService } = jest.requireMock('../../services/pokemonApi');

// Mock do componente PokemonCard
jest.mock('../PokemonCard', () => {
  return function MockPokemonCard({ pokemonItem, onClick, isSelected }: any) {
    return (
      <div 
        data-testid={`pokemon-card-${pokemonItem.name}`}
        onClick={() => onClick?.(pokemonItem)}
        className={isSelected ? 'selected' : ''}
      >
        {pokemonItem.name}
      </div>
    );
  };
});

// Mock do componente Loading
jest.mock('../Loading', () => {
  return function MockLoading({ message, size }: any) {
    return (
      <div data-testid="loading" data-size={size}>
        {message}
      </div>
    );
  };
});

// Dados de teste
const mockPokemonList = {
  count: 1010,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/'
    },
    {
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/'
    }
  ]
};

const mockSearchResults = [
  {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/25/'
  }
];

// Props padrão para os testes
const defaultProps = {
  filters: {
    types: [],
    numberRange: { min: 1, max: 1010 }
  },
  sortBy: { label: 'Número (Crescente)', value: 'id' as const },
  searchTerm: '',
  onLoadingChange: jest.fn()
};

describe('PokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuração dos retornos padrão
    mockPokemonApiService.getPokemonList.mockResolvedValue(mockPokemonList);
    mockPokemonApiService.getAllPokemon.mockResolvedValue(mockPokemonList.results);
    mockPokemonApiService.searchPokemonByName.mockReturnValue(mockSearchResults);
    mockPokemonApiService.extractPokemonId.mockImplementation((url: string) => {
      const match = url.match(/\/pokemon\/(\d+)\//); 
      return match ? parseInt(match[1], 10) : 0;
    });
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o componente sem erros', async () => {
      mockPokemonApiService.getPokemonList.mockResolvedValue(mockPokemonList);

      render(<PokemonList {...defaultProps} />);
      
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Carregando Pokémon...')).toBeInTheDocument();
    });

    it('deve carregar e exibir a lista de Pokémon', async () => {
      mockPokemonApiService.getPokemonList.mockResolvedValue(mockPokemonList);

      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-ivysaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-card-venusaur')).toBeInTheDocument();
    });

    it('deve exibir informações da lista corretamente', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Mostrando 3 de 1010 Pokémon')).toBeInTheDocument();
      });
    });

    it('deve chamar a API com parâmetros corretos', async () => {
      render(<PokemonList {...defaultProps} limit={10} />);
      
      await waitFor(() => {
        expect(mockPokemonApiService.getPokemonList).toHaveBeenCalledWith(0, 10);
      });
    });
  });

  describe('Funcionalidade de busca', () => {
    it('deve realizar busca quando termo é digitado', async () => {
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      
      await waitFor(() => {
        expect(mockPokemonApiService.searchPokemonByName).toHaveBeenCalledWith('pikachu');
      });
    });

    it('deve exibir resultados da busca', async () => {
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('pokemon-card-pikachu')).toBeInTheDocument();
        expect(screen.getByText('1 resultado para "pikachu"')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem quando não encontra resultados', async () => {
      mockPokemonApiService.searchPokemonByName.mockResolvedValue([]);
      
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'pokemon-inexistente' } });
      
      await waitFor(() => {
        expect(screen.getByText('Nenhum Pokémon encontrado')).toBeInTheDocument();
        expect(screen.getByText(/Não encontramos nenhum Pokémon com o nome "pokemon-inexistente"/)).toBeInTheDocument();
      });
    });

    it('deve aplicar debounce na busca', async () => {
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      
      // Simula digitação rápida
      fireEvent.change(searchInput, { target: { value: 'p' } });
      fireEvent.change(searchInput, { target: { value: 'pi' } });
      fireEvent.change(searchInput, { target: { value: 'pik' } });
      fireEvent.change(searchInput, { target: { value: 'pika' } });
      
      // Aguarda o debounce
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
      });
      
      await waitFor(() => {
        expect(mockPokemonApiService.searchPokemonByName).toHaveBeenCalledTimes(1);
        expect(mockPokemonApiService.searchPokemonByName).toHaveBeenCalledWith('pika');
      });
    });
  });

  describe('Ordenação', () => {
    it('deve ordenar por número por padrão', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Ordenado por: Número')).toBeInTheDocument();
      });
    });

    it('deve ordenar por nome quando especificado', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Ordenado por: Nome')).toBeInTheDocument();
      });
    });
  });

  describe('Carregar mais', () => {
    it('deve exibir botão "Carregar Mais" quando há mais resultados', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Carregar Mais Pokémon')).toBeInTheDocument();
      });
    });

    it('deve carregar mais Pokémon quando botão é clicado', async () => {
      const mockMoreResults = {
        count: 1010,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
        previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
        results: [
          {
            name: 'charmander',
            url: 'https://pokeapi.co/api/v2/pokemon/4/'
          }
        ]
      };
      
      mockPokemonApiService.getPokemonList
        .mockResolvedValueOnce(mockPokemonList)
        .mockResolvedValueOnce(mockMoreResults);
      
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Carregar Mais Pokémon')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Carregar Mais Pokémon'));
      
      await waitFor(() => {
        expect(mockPokemonApiService.getPokemonList).toHaveBeenCalledWith(20, 20);
      });
    });

    it('não deve exibir botão "Carregar Mais" durante busca', async () => {
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'pikachu' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Carregar Mais Pokémon')).not.toBeInTheDocument();
      });
    });

    it('deve exibir loading durante carregamento de mais resultados', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Carregar Mais Pokémon')).toBeInTheDocument();
      });
      
      // Mock para simular delay
      mockPokemonApiService.getPokemonList.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockPokemonList), 100))
      );
      
      fireEvent.click(screen.getByText('Carregar Mais Pokémon'));
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });

  describe('Seleção de Pokémon', () => {
    it('deve chamar onPokemonSelect quando um card é clicado', async () => {
      const mockOnSelect = jest.fn();
      
      render(<PokemonList {...defaultProps} onPokemonSelect={mockOnSelect} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('pokemon-card-bulbasaur')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByTestId('pokemon-card-bulbasaur'));
      
      expect(mockOnSelect).toHaveBeenCalledWith({
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      });
    });

    it('deve marcar Pokémon como selecionado', async () => {
      const selectedPokemon = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/'
      };
      
      render(<PokemonList {...defaultProps} selectedPokemon={selectedPokemon} />);
      
      await waitFor(() => {
        const card = screen.getByTestId('pokemon-card-bulbasaur');
        expect(card).toHaveClass('selected');
      });
    });
  });

  describe('Estados de erro', () => {
    it('deve exibir estado de erro quando a API falha', async () => {
      mockPokemonApiService.getPokemonList.mockRejectedValue(new Error('API Error'));
      
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
        expect(screen.getByText('Erro ao carregar a lista de Pokémon. Tente novamente.')).toBeInTheDocument();
      });
    });

    it('deve permitir tentar novamente após erro', async () => {
      mockPokemonApiService.getPokemonList
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce(mockPokemonList);
      
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Tentar Novamente'));
      
      await waitFor(() => {
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
        expect(mockPokemonApiService.getPokemonList).toHaveBeenCalledTimes(2);
      });
    });

    it('deve exibir erro específico para busca', async () => {
      mockPokemonApiService.searchPokemonByName.mockReturnValue([]);
      
      render(<PokemonList {...defaultProps} />);
      
      const searchInput = screen.getByPlaceholderText(/buscar pokémon/i);
      fireEvent.change(searchInput, { target: { value: 'erro' } });
      
      await waitFor(() => {
        expect(screen.getByText('Nenhum Pokémon encontrado')).toBeInTheDocument();
      });
    });
  });

  describe('Props opcionais', () => {
    it('deve aplicar className personalizada', () => {
      render(<PokemonList {...defaultProps} className="custom-class" />);
      
      const list = screen.getByTestId('pokemon-list');
      expect(list).toHaveClass('custom-class');
    });

    it('deve respeitar limite personalizado', async () => {
      render(<PokemonList {...defaultProps} limit={5} />);
      
      await waitFor(() => {
        expect(mockPokemonApiService.getPokemonList).toHaveBeenCalledWith(0, 5);
      });
    });

    it('deve usar scroll infinito em vez de botão', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        // Verifica que não há botão "Carregar Mais"
        expect(screen.queryByText('Carregar Mais Pokémon')).not.toBeInTheDocument();
        // Verifica que o elemento sentinel está presente
        const sentinel = document.querySelector('.scrollSentinel');
        expect(sentinel).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA apropriados', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        expect(grid).toBeInTheDocument();
      });
    });

    it('deve ter labels apropriados nos botões', async () => {
      render(<PokemonList {...defaultProps} />);
      
      await waitFor(() => {
        const loadMoreButton = screen.getByLabelText('Carregar mais Pokémon');
        expect(loadMoreButton).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('deve usar React.memo para evitar re-renderizações desnecessárias', () => {
      const { rerender } = render(<PokemonList {...defaultProps} />);
      
      // Re-renderização com as mesmas props
      rerender(<PokemonList {...defaultProps} />);
      
      // Deve manter a mesma instância do componente
      expect(mockPokemonApiService.getPokemonList).toHaveBeenCalledTimes(1);
    });
  });
});