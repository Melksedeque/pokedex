import React, { useState, useEffect, useRef } from 'react';
import { PokemonTypeName, SortOption } from '../../types/pokemon';
import styles from './PokemonFilters.module.scss';

interface PokemonFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (search: string) => void;
  currentFilters: FilterState;
  currentSort: SortOption;
  currentSearch: string;
  isLoading?: boolean;
}

export interface FilterState {
  types: PokemonTypeName[];
  numberRange: {
    min: number;
    max: number;
  };
}

const POKEMON_TYPES: PokemonTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const SORT_OPTIONS: SortOption[] = [
  { value: 'id', label: 'Número (Crescente)' },
  { value: 'id-desc', label: 'Número (Decrescente)' },
  { value: 'name', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' }
];

const PokemonFilters: React.FC<PokemonFiltersProps> = ({
  onFilterChange,
  onSortChange,
  onSearchChange,
  currentFilters,
  currentSort,
  currentSearch,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Sincronizar estado local com props
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  useEffect(() => {
    setLocalSearch(currentSearch);
  }, [currentSearch]);

  // Debounce da busca
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localSearch, onSearchChange]);

  const handleTypeToggle = (type: PokemonTypeName) => {
    const newTypes = localFilters.types.includes(type)
      ? localFilters.types.filter(t => t !== type)
      : [...localFilters.types, type];
    
    const newFilters = { ...localFilters, types: newTypes };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleNumberRangeChange = (field: 'min' | 'max', value: string) => {
    // Se o valor está vazio ou é inválido, não fazer nada
    if (value === '' || isNaN(Number(value))) {
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Validar limites
    if (numValue < 1 || numValue > 1010) {
      return;
    }
    
    const newFilters = {
      ...localFilters,
      numberRange: {
        ...localFilters.numberRange,
        [field]: numValue
      }
    };
    
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      types: [],
      numberRange: { min: 1, max: 1010 }
    };
    
    setLocalFilters(defaultFilters);
    setLocalSearch('');
    onFilterChange(defaultFilters);
    onSearchChange('');
    onSortChange(SORT_OPTIONS[0]);
  };

  const hasActiveFilters = () => {
    return (
      localFilters.types.length > 0 ||
      localFilters.numberRange.min > 1 ||
      localFilters.numberRange.max < 1010 ||
      localSearch.trim() !== ''
    );
  };

  const getTypeColor = (type: PokemonTypeName): string => {
    const typeColors: Record<PokemonTypeName, string> = {
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
    
    return typeColors[type] || '#68A090';
  };

  return (
    <div className={`${styles.filtersContainer} ${isExpanded ? styles.expanded : ''}`}>
      {/* Barra de busca e controles principais */}
      <div className={styles.mainControls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar Pokémon por nome..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={styles.searchInput}
            disabled={isLoading}
            aria-label="Buscar Pokémon por nome"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className={styles.clearSearchButton}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.sortContainer}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            Ordenar:
          </label>
          <select
            id="sort-select"
            value={currentSort.value}
            onChange={(e) => {
              const selectedOption = SORT_OPTIONS.find(opt => opt.value === e.target.value);
              if (selectedOption) onSortChange(selectedOption);
            }}
            className={styles.sortSelect}
            disabled={isLoading}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${styles.expandButton} ${isExpanded ? styles.active : ''}`}
          aria-label={isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
          aria-expanded={isExpanded}
        >
          <span className={styles.filterIcon}>🔍</span>
          Filtros
          <span className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Painel de filtros expandido */}
      {isExpanded && (
      <div className={styles.filtersPanel}>
        {/* Filtro por número */}
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Número do Pokémon</h3>
          <div className={styles.numberRange}>
            <div className={styles.numberInput}>
              <label htmlFor="min-number">De:</label>
              <input
                id="min-number"
                type="number"
                min="1"
                max="1010"
                value={localFilters.numberRange.min}
                onChange={(e) => handleNumberRangeChange('min', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.numberInput}>
              <label htmlFor="max-number">Até:</label>
              <input
                id="max-number"
                type="number"
                min="1"
                max="1010"
                value={localFilters.numberRange.max}
                onChange={(e) => handleNumberRangeChange('max', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Tipos de Pokémon</h3>
          <div className={styles.typeGrid}>
            {POKEMON_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`${styles.typeButton} ${
                  localFilters.types.includes(type) ? styles.active : ''
                }`}
                style={{
                  '--type-color': getTypeColor(type)
                } as React.CSSProperties}
                disabled={isLoading}
                aria-pressed={localFilters.types.includes(type)}
              >
                <span className={styles.typeIcon}>{type}</span>
                <span className={styles.typeName}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ações dos filtros */}
        <div className={styles.filterActions}>
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={clearAllFilters}
              className={styles.clearButton}
              disabled={isLoading}
            >
              Limpar Filtros
            </button>
          )}
          
          <div className={styles.activeFiltersCount}>
            {localFilters.types.length > 0 && (
              <span className={styles.filterCount}>
                {localFilters.types.length} tipo{localFilters.types.length > 1 ? 's' : ''} selecionado{localFilters.types.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PokemonFilters;