export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  front_female?: string;
  front_shiny_female?: string;
  back_default: string;
  back_shiny: string;
  back_female?: string;
  back_shiny_female?: string;
  other: {
    'official-artwork': {
      front_default: string;
      front_shiny: string;
    };
    home: {
      front_default: string;
      front_female?: string;
      front_shiny: string;
      front_shiny_female?: string;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  abilities: PokemonAbility[];
  forms: Array<{
    name: string;
    url: string;
  }>;
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  held_items: Array<{
    item: {
      name: string;
      url: string;
    };
    version_details: Array<{
      rarity: number;
      version: {
        name: string;
        url: string;
      };
    }>;
  }>;
  location_area_encounters: string;
  moves: PokemonMove[];
  species: {
    name: string;
    url: string;
  };
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  past_types: Array<{
    generation: {
      name: string;
      url: string;
    };
    types: PokemonType[];
  }>;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  form_descriptions: Array<{
    description: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

// Tipos para filtros e busca
export interface PokemonFilters {
  search: string;
  type: string;
  sortBy: 'number' | 'name';
  sortOrder: 'asc' | 'desc';
}

// Tipos para o estado da aplicação
export interface PokemonState {
  pokemonList: PokemonListItem[];
  filteredPokemon: PokemonListItem[];
  selectedPokemon: Pokemon | null;
  pokemonDetails: { [key: string]: Pokemon };
  pokemonSpecies: { [key: string]: PokemonSpecies };
  loading: boolean;
  error: string | null;
  filters: PokemonFilters;
  currentPage: number;
  totalPages: number;
}

// Tipos para cores dos tipos de Pokémon
export type PokemonTypeColor = {
  [key: string]: string;
};

export const POKEMON_TYPE_COLORS: PokemonTypeColor = {
  bug: 'var(--bug)',
  dark: 'var(--dark)',
  dragon: 'var(--dragon)',
  electric: 'var(--electric)',
  fairy: 'var(--fairy)',
  fighting: 'var(--fighting)',
  fire: 'var(--fire)',
  flying: 'var(--flying)',
  ghost: 'var(--ghost)',
  grass: 'var(--grass)',
  ground: 'var(--ground)',
  ice: 'var(--ice)',
  normal: 'var(--normal)',
  poison: 'var(--poison)',
  psychic: 'var(--psychic)',
  rock: 'var(--rock)',
  steel: 'var(--steel)',
  water: 'var(--water)',
};