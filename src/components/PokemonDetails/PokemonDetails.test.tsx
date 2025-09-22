import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonDetails from './index';
import { Pokemon, PokemonSpecies } from '../../types/pokemon';

// Mock do serviço da API
// Mock do serviço de API
const mockGetPokemonDetails = jest.fn();
const mockGetPokemonSpecies = jest.fn();
const mockGetTypeColor = jest.fn().mockReturnValue('#68A090');

jest.mock('../../services/pokemonApi', () => {
  return {
    PokemonApiService: jest.fn().mockImplementation(() => {
      return {
        getPokemonDetails: mockGetPokemonDetails,
        getPokemonSpecies: mockGetPokemonSpecies,
        getTypeColor: mockGetTypeColor,
      };
    })
  };
});

// Mock dos componentes
jest.mock('../Loading', () => {
  return function MockLoading({ message }: { message?: string }) {
    return <div data-testid="loading">{message || 'Carregando...'}</div>;
  };
});

// Dados de teste
const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  is_default: true,
  order: 35,
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: '',
  moves: [],
  species: {
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
  },
  past_types: [],
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    front_shiny: 'https://example.com/pikachu-shiny.png',
    front_female: undefined,
    front_shiny_female: undefined,
    back_default: 'https://example.com/pikachu-back.png',
    back_shiny: 'https://example.com/pikachu-back-shiny.png',
    back_female: undefined,
    back_shiny_female: undefined,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/pikachu-artwork.png',
        front_shiny: 'https://example.com/pikachu-artwork-shiny.png'
      },
      home: {
        front_default: 'https://example.com/pikachu-home.png',
        front_female: undefined,
        front_shiny: 'https://example.com/pikachu-home-shiny.png',
        front_shiny_female: undefined
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
    },
    {
      base_stat: 50,
      effort: 1,
      stat: {
        name: 'special-attack',
        url: 'https://pokeapi.co/api/v2/stat/4/'
      }
    },
    {
      base_stat: 50,
      effort: 0,
      stat: {
        name: 'special-defense',
        url: 'https://pokeapi.co/api/v2/stat/5/'
      }
    },
    {
      base_stat: 90,
      effort: 2,
      stat: {
        name: 'speed',
        url: 'https://pokeapi.co/api/v2/stat/6/'
      }
    }
  ],
  abilities: [
    {
      ability: {
        name: 'static',
        url: 'https://pokeapi.co/api/v2/ability/9/'
      },
      is_hidden: false,
      slot: 1
    },
    {
      ability: {
        name: 'lightning-rod',
        url: 'https://pokeapi.co/api/v2/ability/31/'
      },
      is_hidden: true,
      slot: 3
    }
  ]
};

const mockSpecies: PokemonSpecies = {
  id: 25,
  name: 'pikachu',
  order: 35,
  gender_rate: 4,
  capture_rate: 190,
  base_happiness: 50,
  is_baby: false,
  is_legendary: false,
  is_mythical: false,
  hatch_counter: 10,
  has_gender_differences: false,
  forms_switchable: false,
  growth_rate: {
    name: 'medium',
    url: 'https://pokeapi.co/api/v2/growth-rate/2/'
  },
  pokedex_numbers: [],
  egg_groups: [],
  color: {
    name: 'yellow',
    url: 'https://pokeapi.co/api/v2/pokemon-color/10/'
  },
  shape: {
    name: 'quadruped',
    url: 'https://pokeapi.co/api/v2/pokemon-shape/8/'
  },
  evolves_from_species: null,
  habitat: null,
  generation: {
    name: 'generation-i',
    url: 'https://pokeapi.co/api/v2/generation/1/'
  },
  names: [],
  form_descriptions: [],
  varieties: [],
  flavor_text_entries: [
    {
      flavor_text: 'When several of these POKéMON gather, their electricity could build and cause lightning storms.',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/'
      },
      version: {
        name: 'red',
        url: 'https://pokeapi.co/api/v2/version/1/'
      }
    }
  ],
  genera: [
    {
      genus: 'Mouse Pokémon',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/'
      }
    }
  ],
  evolution_chain: {
    url: 'https://pokeapi.co/api/v2/evolution-chain/10/'
  }
};

describe('PokemonDetails', () => {
  beforeEach(() => {
    // Reset dos mocks
    jest.clearAllMocks();
    mockGetPokemonDetails.mockClear();
    mockGetPokemonSpecies.mockClear();
    mockGetTypeColor.mockClear();
    
    // Configurar mock padrão para getTypeColor
    mockGetTypeColor.mockReturnValue('#68A090');
  });

  it('deve renderizar o estado de loading inicialmente', () => {
    mockGetPokemonDetails.mockImplementation(() => new Promise(() => {}));
    mockGetPokemonSpecies.mockImplementation(() => new Promise(() => {}));

    render(<PokemonDetails pokemon="25" />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Carregando detalhes de 25...')).toBeInTheDocument();
  });

  it('deve renderizar os detalhes do Pokémon após carregamento', async () => {
    // Configurar mocks para retornar dados válidos imediatamente
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    // Verificar se o loading aparece primeiro
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Aguarda que o componente principal seja renderizado
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verificar se o componente principal foi renderizado
    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
  });

  it('deve exibir as abas de navegação', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Sobre')).toBeInTheDocument();
    });

    expect(screen.getByText('Estatísticas')).toBeInTheDocument();
    expect(screen.getByText('Evolução')).toBeInTheDocument();
  });

  it('deve alternar entre as abas quando clicadas', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Sobre')).toBeInTheDocument();
    });

    // Aba "Sobre" deve estar ativa por padrão
    expect(screen.getByText('Altura')).toBeInTheDocument();
    expect(screen.getByText('0.4 m')).toBeInTheDocument();

    // Clicar na aba "Estatísticas"
    fireEvent.click(screen.getByText('Estatísticas'));
    
    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument();
    });
    
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('Ataque')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('deve exibir informações corretas na aba Sobre', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Altura')).toBeInTheDocument();
    });

    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('Peso')).toBeInTheDocument();
    expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    expect(screen.getByText('Experiência Base')).toBeInTheDocument();
    expect(screen.getByText('112')).toBeInTheDocument();
    expect(screen.getByText('Habilidades')).toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    expect(screen.getByText('Lightning Rod (Oculta)')).toBeInTheDocument();
  });

  it('deve exibir todas as estatísticas na aba Estatísticas', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Estatísticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Estatísticas'));
    
    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument();
    });

    expect(screen.getByText('Ataque')).toBeInTheDocument();
    expect(screen.getByText('Defesa')).toBeInTheDocument();
    expect(screen.getByText('At. Esp.')).toBeInTheDocument();
    expect(screen.getByText('Def. Esp.')).toBeInTheDocument();
    expect(screen.getByText('Velocidade')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando falha ao carregar', async () => {
    const errorMessage = 'Erro ao carregar Pokémon';
    mockGetPokemonDetails.mockRejectedValue(new Error(errorMessage));
    mockGetPokemonSpecies.mockRejectedValue(new Error(errorMessage));

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar os detalhes do Pokémon. Tente novamente.')).toBeInTheDocument();
    });

    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  it('deve tentar carregar novamente quando botão é clicado', async () => {
    const errorMessage = 'Erro ao carregar Pokémon';
    mockGetPokemonDetails.mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tentar Novamente'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('deve chamar onBack quando botão voltar é clicado', async () => {
    const mockOnBack = jest.fn();
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" onClose={mockOnBack} />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Voltar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Voltar'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('deve aplicar classe CSS baseada no tipo do Pokémon', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    const detailsContainer = screen.getByTestId('pokemon-details');
    expect(detailsContainer).toBeInTheDocument();
  });

  it('deve ter atributos de acessibilidade corretos', async () => {
    mockGetPokemonDetails.mockResolvedValue(mockPokemon);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('deve formatar corretamente o número do Pokémon', async () => {
    const pokemonWithHighId = { ...mockPokemon, id: 150 };
    mockGetPokemonDetails.mockResolvedValue(pokemonWithHighId);
    mockGetPokemonSpecies.mockResolvedValue({ ...mockSpecies, id: 150 });

    render(<PokemonDetails pokemon="150" />);
    
    await waitFor(() => {
      expect(screen.getByText('#150')).toBeInTheDocument();
    });
  });

  it('deve lidar com Pokémon sem imagem oficial', async () => {
    const pokemonWithoutOfficialArt = {
      ...mockPokemon,
      sprites: {
        ...mockPokemon.sprites,
        front_default: 'https://example.com/pikachu.png',
        other: {
          'official-artwork': {
            front_default: null
          }
        }
      }
    };
    
    mockGetPokemonDetails.mockResolvedValue(pokemonWithoutOfficialArt);
    mockGetPokemonSpecies.mockResolvedValue(mockSpecies);

    render(<PokemonDetails pokemon="25" />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    expect(screen.getByTestId('pokemon-details')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });

    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });
});