import axios from 'axios';
import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  PokemonListItem,
} from 'types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

export class PokemonApiService {
  /**
   * Busca uma lista de Pokémon com paginação
   * @param limit Número de Pokémon por página (padrão: 20)
   * @param offset Offset para paginação (padrão: 0)
   * @returns Promise com a lista de Pokémon
   */
  static async getPokemonList(
    limit: number = 20,
    offset: number = 0
  ): Promise<PokemonListResponse> {
    try {
      const response = await api.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar lista de Pokémon');
    }
  }

  /**
   * Busca todos os Pokémon (para filtros locais)
   * @param limit Limite máximo (padrão: 1010 para pegar todos)
   * @returns Promise com a lista completa de Pokémon
   */
  static async getAllPokemon(limit: number = 1010): Promise<PokemonListItem[]> {
    try {
      const response = await api.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=0`
      );
      return response.data.results;
    } catch (error) {
      throw new Error('Erro ao buscar todos os Pokémon');
    }
  }

  /**
   * Busca detalhes de um Pokémon específico
   * @param pokemonId ID ou nome do Pokémon
   * @returns Promise com os detalhes do Pokémon
   */
  static async getPokemonDetails(pokemonId: string | number): Promise<Pokemon> {
    try {
      const response = await api.get<Pokemon>(`/pokemon/${pokemonId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar detalhes do Pokémon: ${pokemonId}`);
    }
  }

  /**
   * Busca informações da espécie de um Pokémon
   * @param pokemonId ID ou nome do Pokémon
   * @returns Promise com as informações da espécie
   */
  static async getPokemonSpecies(
    pokemonId: string | number
  ): Promise<PokemonSpecies> {
    try {
      const response = await api.get<PokemonSpecies>(
        `/pokemon-species/${pokemonId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar espécie do Pokémon: ${pokemonId}`);
    }
  }

  /**
   * Busca Pokémon por nome (busca parcial)
   * @param name Nome ou parte do nome do Pokémon
   * @param allPokemon Lista completa de Pokémon para filtrar
   * @returns Array de Pokémon que correspondem à busca
   */
  static searchPokemonByName(
    name: string,
    allPokemon: PokemonListItem[]
  ): PokemonListItem[] {
    if (!name.trim()) return allPokemon;
    
    const searchTerm = name.toLowerCase().trim();
    return allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Busca informações da espécie do Pokémon
   */
  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    try {
      const response = await api.get<PokemonSpecies>(`/pokemon-species/${nameOrId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar espécie do Pokémon:', error);
      throw new Error(`Falha ao carregar informações da espécie do Pokémon: ${nameOrId}`);
    }
  }

  /**
   * Extrai o ID do Pokémon a partir da URL
   * @param url URL do Pokémon da API
   * @returns ID do Pokémon
   */
  static extractPokemonId(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//); 
    return matches ? parseInt(matches[1], 10) : 0;
  }

  /**
   * Busca Pokémon por tipo
   * @param type Tipo do Pokémon (ex: 'fire', 'water')
   * @returns Promise com lista de Pokémon do tipo especificado
   */
  static async getPokemonByType(type: string): Promise<PokemonListItem[]> {
    try {
      const response = await api.get(`/type/${type}`);
      return response.data.pokemon.map((p: any) => p.pokemon);
    } catch (error) {
      throw new Error(`Erro ao buscar Pokémon do tipo: ${type}`);
    }
  }

  /**
   * Busca todos os tipos de Pokémon disponíveis
   * @returns Promise com lista de tipos
   */
  static async getAllTypes(): Promise<Array<{ name: string; url: string }>> {
    try {
      const response = await api.get('/type');
      return response.data.results;
    } catch (error) {
      throw new Error('Erro ao buscar tipos de Pokémon');
    }
  }

  /**
   * Ordena lista de Pokémon
   * @param pokemonList Lista de Pokémon para ordenar
   * @param sortBy Critério de ordenação ('name' ou 'number')
   * @param sortOrder Ordem ('asc' ou 'desc')
   * @returns Lista ordenada
   */
  static sortPokemonList(
    pokemonList: PokemonListItem[],
    sortBy: 'name' | 'number',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): PokemonListItem[] {
    const sorted = [...pokemonList].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const idA = this.extractPokemonId(a.url);
        const idB = this.extractPokemonId(b.url);
        return sortOrder === 'asc' ? idA - idB : idB - idA;
      }
    });
    
    return sorted;
  }

  /**
   * Formata o nome do Pokémon para exibição
   * @param name Nome do Pokémon
   * @returns Nome formatado
   */
  static formatPokemonName(name: string): string {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Formata o número do Pokémon com zeros à esquerda
   * @param id ID do Pokémon
   * @returns Número formatado (ex: #001)
   */
  static formatPokemonNumber(id: number): string {
    return `#${id.toString().padStart(3, '0')}`;
  }

  /**
   * Converte altura de decímetros para metros
   * @param height Altura em decímetros
   * @returns Altura em metros formatada
   */
  static formatHeight(height: number): string {
    const meters = height / 10;
    return `${meters.toFixed(1)} m`;
  }

  /**
   * Converte peso de hectogramas para quilogramas
   * @param weight Peso em hectogramas
   * @returns Peso em quilogramas formatado
   */
  static formatWeight(weight: number): string {
    const kg = weight / 10;
    return `${kg.toFixed(1)} kg`;
  }

  /**
   * Obtém a descrição em português do Pokémon
   * @param species Dados da espécie do Pokémon
   * @returns Descrição em português ou em inglês como fallback
   */
  static getPokemonDescription(species: PokemonSpecies): string {
    // Busca descrição em português
    const ptDescription = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'pt'
    );
    
    if (ptDescription) {
      return ptDescription.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }
    
    // Fallback para inglês
    const enDescription = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );
    
    return enDescription
      ? enDescription.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
      : 'Descrição não disponível.';
  }

  /**
   * Obtém o nome em português do Pokémon
   * @param species Dados da espécie do Pokémon
   * @returns Nome em português ou nome original como fallback
   */
  static getPokemonPortugueseName(species: PokemonSpecies): string {
    const ptName = species.names.find(
      (name) => name.language.name === 'pt'
    );
    
    return ptName ? ptName.name : species.name;
  }

  /**
   * Obtém a cor associada a um tipo de Pokémon
   * @param typeName Nome do tipo
   * @returns Cor hexadecimal do tipo
   */
  getTypeColor(typeName: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    
    return typeColors[typeName] || '#68A090';
  }
}

export default PokemonApiService;