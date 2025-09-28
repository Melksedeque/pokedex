import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PokemonCard from '../PokemonCard';
import Loading from '../Loading';
import { FilterState } from '../PokemonFilters';
import PokemonApiService from '../../services/pokemonApi';
import { PokemonListItem, Pokemon, SortOption } from '../../types/pokemon';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import styles from './PokemonList.module.scss';

interface PokemonListProps {
  onPokemonSelect?: (pokemon: PokemonListItem) => void;
  selectedPokemon?: PokemonListItem | null;
  className?: string;
  limit?: number;
  // Novos props para filtros
  filters: FilterState;
  sortBy: SortOption;
  searchTerm: string;
  onLoadingChange?: (loading: boolean) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({
  onPokemonSelect,
  selectedPokemon,
  className = '',
  limit = 20,
  filters,
  sortBy,
  searchTerm,
  onLoadingChange
}) => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Usando métodos estáticos da PokemonApiService

  // Função para carregar a lista inicial de Pokémon
  const loadInitialPokemon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PokemonApiService.getPokemonList(limit, 0);
      
      setPokemonList(response.results);
      setTotalCount(response.count);
      setCurrentOffset(limit);
      setHasMore(response.results.length === limit && response.count > limit);
    } catch (err) {
      console.error('Erro ao carregar lista de Pokémon:', err);
      setError('Erro ao carregar a lista de Pokémon. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Função para carregar mais Pokémon
  const loadMorePokemon = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      
      const response = await PokemonApiService.getPokemonList(limit, currentOffset);
      
      setPokemonList(prev => [...prev, ...response.results]);
      setCurrentOffset(prev => prev + limit);
      setHasMore(response.results.length === limit && (currentOffset + limit) < totalCount);
    } catch (err) {
      console.error('Erro ao carregar mais Pokémon:', err);
      setError('Erro ao carregar mais Pokémon. Tente novamente.');
    } finally {
      setLoadingMore(false);
    }
  }, [currentOffset, limit, loadingMore, hasMore, totalCount]);

  // Hook para scroll infinito - como a Força, detecta quando você precisa de mais Pokémon! ⚡
  const { sentinelRef, isPreparing } = useInfiniteScroll({
    onLoadMore: loadMorePokemon,
    hasMore: hasMore && !searchTerm, // Só carrega mais se não estiver em busca
    isLoading: loadingMore,
    threshold: 400 // Carrega quando está a 400px do final
  });

  // Função para buscar Pokémon por nome
  const searchPokemon = useCallback(async (term: string) => {
    if (!term.trim()) {
      loadInitialPokemon();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const results = PokemonApiService.searchPokemonByName(term.toLowerCase().trim(), pokemonList);
      
      if (results.length === 0) {
        setError(`Nenhum Pokémon encontrado com o nome "${term}".`);
        setPokemonList([]);
      } else {
        setPokemonList(results);
        setError(null);
      }
      
      setHasMore(false); // Não há "carregar mais" em busca
    } catch (err) {
      console.error('Erro na busca:', err);
      setError(`Erro ao buscar por "${term}". Verifique o nome e tente novamente.`);
      setPokemonList([]);
    } finally {
      setLoading(false);
    }
  }, [loadInitialPokemon]);

  // Filtrar e ordenar a lista
  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = [...pokemonList];

    // Aplicar filtro por intervalo de números
    filtered = filtered.filter(p => {
      const id = PokemonApiService.extractPokemonId(p.url);
      return id >= filters.numberRange.min && id <= filters.numberRange.max;
    });

    // Ordenar a lista
    filtered.sort((a, b) => {
      const idA = PokemonApiService.extractPokemonId(a.url);
        const idB = PokemonApiService.extractPokemonId(b.url);

      switch (sortBy.value) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'id-desc':
          return idB - idA;
        case 'number':
        case 'id':
        default:
          return idA - idB;
      }
    });

    return filtered;
  }, [pokemonList, filters, sortBy]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadInitialPokemon();
  }, [loadInitialPokemon]);

  // Efeito para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        searchPokemon(searchTerm);
      } else {
        loadInitialPokemon();
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchPokemon, loadInitialPokemon]);

  // Efeito para notificar mudanças de loading
  useEffect(() => {
    onLoadingChange?.(loading || loadingMore);
  }, [loading, loadingMore, onLoadingChange]);

  // Função para lidar com clique no card
  const handlePokemonClick = useCallback((pokemon: Pokemon) => {
    // Converte Pokemon para PokemonListItem para compatibilidade
    const pokemonListItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
    };
    onPokemonSelect?.(pokemonListItem);
  }, [onPokemonSelect]);

  // Função para verificar se um Pokémon está selecionado
  const isPokemonSelected = useCallback((pokemon: PokemonListItem) => {
    return selectedPokemon?.name === pokemon.name;
  }, [selectedPokemon]);

  // Renderização do estado de loading inicial
  if (loading && pokemonList.length === 0) {
    return (
      <div className={`${styles.pokemonList} ${className}`}>
        <Loading 
          message="Carregando Pokémon..."
          size="large"
        />
      </div>
    );
  }

  // Renderização do estado de erro
  if (error && pokemonList.length === 0) {
    return (
      <div className={`${styles.pokemonList} ${styles.errorState} ${className}`}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Oops! Algo deu errado</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={loadInitialPokemon}
            type="button"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pokemonList} ${className}`} data-testid="pokemon-list">
      {/* Informações da lista */}
      <div className={styles.listInfo}>
        <div className={styles.resultCount}>
          {searchTerm ? (
            <span>
              {filteredAndSortedPokemon.length} resultado{filteredAndSortedPokemon.length !== 1 ? 's' : ''} 
              para "{searchTerm}"
            </span>
          ) : (
            <span>
              Mostrando {filteredAndSortedPokemon.length} de {totalCount} Pokémon
            </span>
          )}
        </div>
        
        {sortBy && (
          <div className={styles.sortInfo}>
            Ordenado por: {sortBy.value === 'name' ? 'Nome' : 'Número'}
          </div>
        )}
      </div>

      {/* Grid de cards */}
      <div className={styles.pokemonGrid} role="grid">
        {filteredAndSortedPokemon.map((pokemon, index) => (
          <div 
            key={`${pokemon.name}-${index}`}
            className={styles.gridItem}
            role="gridcell"
            style={{
              animationDelay: `${Math.min(index * 0.1, 2)}s`
            }}
          >
            <PokemonCard
              pokemonItem={pokemon}
              onClick={handlePokemonClick}
              isSelected={isPokemonSelected(pokemon)}
            />
          </div>
        ))}
      </div>

      {/* Elemento sentinel para scroll infinito - invisível, mas poderoso como um Jedi! */}
      {hasMore && !searchTerm && (
        <div 
          ref={sentinelRef}
          className={styles.scrollSentinel}
          aria-hidden="true"
        />
      )}

      {/* Indicador de preparação - feedback imediato como um Patronus! ✨ */}
      {isPreparing && !loadingMore && (
        <div className={styles.preparingIndicator}>
          <div className={styles.preparingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className={styles.preparingText}>Preparando...</p>
        </div>
      )}

      {/* Loading melhorado para scroll infinito */}
      {loadingMore && (
        <div className={styles.infiniteScrollLoading}>
          <Loading 
            message=""
            size="small"
          />
          <p className={styles.loadingText}>
            Descobrindo mais Pokémon...
          </p>
          <p className={styles.loadingSubtext}>
            ✨ Preparando novas aventuras para você!
          </p>
        </div>
      )}

      {/* Mensagem quando não há mais resultados */}
      {!hasMore && pokemonList.length > 0 && !searchTerm && (
        <div className={styles.endMessage}>
          <p>🎉 Você viu todos os Pokémon disponíveis!</p>
        </div>
      )}

      {/* Estado vazio para busca */}
      {searchTerm && filteredAndSortedPokemon.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>Nenhum Pokémon encontrado</h3>
          <p className={styles.emptyMessage}>
            Não encontramos nenhum Pokémon com o nome "{searchTerm}".
            <br />
            Tente buscar por outro nome!
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(PokemonList);