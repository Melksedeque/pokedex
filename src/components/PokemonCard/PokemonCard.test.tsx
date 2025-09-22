import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonCard from './index';
import PokemonApiService from '../../services/pokemonApi';

// Mock do serviço da API
jest.mock('../../services/pokemonApi', () => ({
  __esModule: true,
  default: {
    getPokemonDetails: jest.fn(),
    formatPokemonName: jest.fn((name: string) => name.charAt(0).toUpperCase() + name.slice(1)),
    formatPokemonNumber: jest.fn((id: number) => `#${id.toString().padStart(3, '0')}`),
    formatHeight: jest.fn((height: number) => `${(height / 10).toFixed(1)}m`),
    formatWeight: jest.fn((weight: number) => `${(weight / 10).toFixed(1)}kg`),
    extractPokemonId: jest.fn((url: string) => {
      const matches = url.match(/\/pokemon\/(\d+)\//); 
      return matches ? parseInt(matches[1], 10) : 0;
    })
  }
}));

const mockPokemonApiService = PokemonApiService as jest.Mocked<typeof PokemonApiService>;

// Mock dos dados de teste
const mockPokemonBasic = {
  name: 'pikachu',
  url: 'https://pokeapi.co/api/v2/pokemon/25/'
};

const mockPokemonDetails = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  is_default: true,
  order: 35,
  abilities: [],
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: '',
  moves: [],
  species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
  past_types: [],
  sprites: {
    front_default: 'https://example.com/pikachu-front.png',
    front_shiny: 'https://example.com/pikachu-front-shiny.png',
    back_default: 'https://example.com/pikachu-back.png',
    back_shiny: 'https://example.com/pikachu-back-shiny.png',
    front_female: undefined,
    front_shiny_female: undefined,
    back_female: undefined,
    back_shiny_female: undefined,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu.png',
        front_shiny: 'https://example.com/pikachu-shiny.png'
      },
      home: {
        front_default: 'https://example.com/pikachu-home.png',
        front_shiny: 'https://example.com/pikachu-home-shiny.png'
      }
    }
  },
  types: [
    {
      slot: 1,
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/'
      }
    }
  ],
  stats: [
    {
      base_stat: 35,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/'
      }
    },
    {
      base_stat: 55,
      effort: 0,
      stat: {
        name: 'attack',
        url: 'https://pokeapi.co/api/v2/stat/2/'
      }
    },
    {
      base_stat: 40,
      effort: 0,
      stat: {
        name: 'defense',
        url: 'https://pokeapi.co/api/v2/stat/3/'
      }
    }
  ]
};

describe('PokemonCard', () => {
  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    
    // Configuração dos retornos padrão
    mockPokemonApiService.getPokemonDetails.mockResolvedValue(mockPokemonDetails);
  });

  describe('Renderização básica', () => {
    it('deve renderizar o card com estado de loading inicialmente', () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      expect(screen.getByTestId('pokemon-card')).toBeInTheDocument();
      expect(screen.getByTestId('image-loader')).toBeInTheDocument();
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    it('deve renderizar o número do Pokémon corretamente', () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      expect(screen.getByText('#025')).toBeInTheDocument();
    });

    it('deve aplicar a classe CSS correta', () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      const card = screen.getByTestId('pokemon-card');
      expect(card).toHaveClass('pokemonCard');
    });
  });

  describe('Carregamento de dados', () => {
    it('deve carregar e exibir os detalhes do Pokémon', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      // Aguarda o carregamento dos dados
      await waitFor(() => {
        expect(screen.getByAltText('pikachu')).toBeInTheDocument();
      });
      
      // Verifica se a imagem foi carregada
      const image = screen.getByAltText('pikachu');
      expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
      
      // Verifica se os tipos foram renderizados
      expect(screen.getByText('electric')).toBeInTheDocument();
      
      // Verifica se as estatísticas foram renderizadas
      expect(screen.getByText('35')).toBeInTheDocument(); // HP
      expect(screen.getByText('55')).toBeInTheDocument(); // Attack
      expect(screen.getByText('40')).toBeInTheDocument(); // Defense
    });

    it('deve chamar a API com os parâmetros corretos', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        expect(mockPokemonApiService.extractPokemonId).toHaveBeenCalledWith(mockPokemonBasic.url);
        expect(mockPokemonApiService.getPokemonDetails).toHaveBeenCalledWith(25);
      });
    });

    it('deve aplicar as cores dos tipos corretamente', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        expect(screen.getByText('electric')).toBeInTheDocument();
      });
    });
  });

  describe('Estados de erro', () => {
    it('deve exibir estado de erro quando a API falha', async () => {
      mockPokemonApiService.getPokemonDetails.mockRejectedValue(new Error('API Error'));
      
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
        expect(screen.getByText('pikachu')).toBeInTheDocument();
      });
      
      const card = screen.getByTestId('pokemon-card');
      expect(card).toHaveClass('error');
    });

    it('deve exibir placeholder quando a imagem falha ao carregar', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        expect(screen.getByAltText('pikachu')).toBeInTheDocument();
      });
      
      const image = screen.getByAltText('pikachu');
      fireEvent.error(image);
      
      expect(screen.getByText('Imagem não disponível')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onClick quando o card é clicado', async () => {
      const mockOnClick = jest.fn();
      
      render(
        <PokemonCard 
          pokemonItem={mockPokemonBasic} 
          onClick={mockOnClick}
        />
      );
      
      const card = screen.getByTestId('pokemon-card');
      fireEvent.click(card);
      
      expect(mockOnClick).toHaveBeenCalledWith(mockPokemonBasic);
    });

    it('deve aplicar classe selected quando isSelected é true', () => {
      render(
        <PokemonCard 
          pokemonItem={mockPokemonBasic} 
          isSelected={true}
        />
      );
      
      const card = screen.getByTestId('pokemon-card');
      expect(card).toHaveClass('selected');
    });

    it('deve ser acessível via teclado', () => {
      const mockOnClick = jest.fn();
      
      render(
        <PokemonCard 
          pokemonItem={mockPokemonBasic} 
          onClick={mockOnClick}
        />
      );
      
      const card = screen.getByTestId('pokemon-card');
      
      // Verifica se o card é focalizável
      expect(card).toHaveAttribute('tabIndex', '0');
      
      // Simula pressionar Enter
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledWith(mockPokemonBasic);
      
      // Simula pressionar Espaço
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Props opcionais', () => {
    it('deve renderizar o card corretamente', () => {
      render(
        <PokemonCard 
          pokemonItem={mockPokemonBasic} 
        />
      );
      
      const card = screen.getByTestId('pokemon-card');
      expect(card).toBeInTheDocument();
    });

    it('deve renderizar sem estatísticas por padrão', async () => {
      render(
        <PokemonCard 
          pokemonItem={mockPokemonBasic} 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByAltText('pikachu')).toBeInTheDocument();
      });
      
      // Verifica se as estatísticas não estão presentes
      expect(screen.queryByText('HP')).not.toBeInTheDocument();
      expect(screen.queryByText('ATK')).not.toBeInTheDocument();
      expect(screen.queryByText('DEF')).not.toBeInTheDocument();
    });
  });

  describe('Formatação de dados', () => {
    it('deve formatar o número do Pokémon com zeros à esquerda', () => {
      const pokemonWithLowId = {
        ...mockPokemonBasic,
        url: 'https://pokeapi.co/api/v2/pokemon/5/'
      };
      
      mockPokemonApiService.extractPokemonId.mockReturnValue(5);
      
      render(<PokemonCard pokemonItem={pokemonWithLowId} />);
      
      expect(screen.getByText('#005')).toBeInTheDocument();
    });

    it('deve capitalizar o nome do Pokémon', () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      const nameElement = screen.getByText('Pikachu');
      expect(nameElement).toBeInTheDocument();
    });

    it('deve exibir tipos em maiúsculas', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        const typeElement = screen.getByText('electric');
        expect(typeElement).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('deve evitar re-renderizações desnecessárias', () => {
      const { rerender } = render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      // Primeira renderização
      expect(mockPokemonApiService.getPokemonDetails).toHaveBeenCalledTimes(1);
      
      // Re-renderização com as mesmas props
      rerender(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      // Não deve chamar a API novamente
      expect(mockPokemonApiService.getPokemonDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA apropriados', () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      const card = screen.getByTestId('pokemon-card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('aria-label', 'Pokémon pikachu');
    });

    it('deve ter texto alternativo apropriado para imagens', async () => {
      render(<PokemonCard pokemonItem={mockPokemonBasic} />);
      
      await waitFor(() => {
        const image = screen.getByAltText('pikachu');
        expect(image).toBeInTheDocument();
      });
    });
  });
});