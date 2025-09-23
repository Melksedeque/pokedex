import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PokemonApiService } from '../../services/pokemonApi';
import { Pokemon, PokemonSpecies, PokemonListItem } from '../../types/pokemon';
import Loading from '../Loading';
import styles from './PokemonDetails.module.scss';

interface PokemonDetailsProps {
  pokemon: PokemonListItem | string;
  onClose?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  className?: string;
}

interface PokemonStat {
  name: string;
  value: number;
  maxValue: number;
  color: string;
}

const PokemonDetails: React.FC<PokemonDetailsProps> = ({
  pokemon,
  onClose,
  onNavigate,
  showNavigation = true,
  className = ''
}) => {
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'evolution'>('about');

  const apiService = useMemo(() => new PokemonApiService(), []);

  // Determinar o nome do Pokémon
  const pokemonName = useMemo(() => {
    return typeof pokemon === 'string' ? pokemon : pokemon.name;
  }, [pokemon]);

  // Carregar dados do Pokémon
  const loadPokemonData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setImageLoaded(false);
      
      const [pokemonDetails, speciesDetails] = await Promise.all([
        PokemonApiService.getPokemonDetails(pokemonName),
        PokemonApiService.getPokemonSpecies(pokemonName)
      ]);
      
      setPokemonData(pokemonDetails);
      setSpeciesData(speciesDetails);
    } catch (err) {
      console.error('Erro ao carregar detalhes do Pokémon:', err);
      setError('Erro ao carregar os detalhes do Pokémon. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [apiService, pokemonName]);

  // Efeito para carregar dados quando o Pokémon muda
  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  // Processar estatísticas para exibição
  const processedStats = useMemo((): PokemonStat[] => {
    if (!pokemonData) return [];

    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidade'
    };

    const statColors: { [key: string]: string } = {
      'hp': '#FF5959',
      'attack': '#F5AC78',
      'defense': '#FAE078',
      'special-attack': '#9DB7F5',
      'special-defense': '#A7DB8D',
      'speed': '#FA92B2'
    };

    return pokemonData.stats.map(stat => ({
      name: statNames[stat.stat.name] || stat.stat.name,
      value: stat.base_stat,
      maxValue: 255, // Valor máximo teórico para estatísticas
      color: statColors[stat.stat.name] || '#68A090'
    }));
  }, [pokemonData]);

  // Calcular total das estatísticas
  const totalStats = useMemo(() => {
    return processedStats.reduce((total, stat) => total + stat.value, 0);
  }, [processedStats]);

  // Obter cor primária baseada no tipo
  const primaryColor = useMemo(() => {
    if (!pokemonData || !pokemonData.types.length) return '#68A090';
    return apiService.getTypeColor(pokemonData.types[0].type.name);
  }, [pokemonData, apiService]);

  // Formatar altura e peso
  const formatHeight = useCallback((height: number) => {
    return `${(height / 10).toFixed(1)} m`;
  }, []);

  const formatWeight = useCallback((weight: number) => {
    return `${(weight / 10).toFixed(1)} kg`;
  }, []);

  // Obter descrição do Pokémon
  const pokemonDescription = useMemo(() => {
    if (!speciesData || !speciesData.flavor_text_entries) return '';
    
    const portugueseEntry = speciesData.flavor_text_entries.find(
      entry => entry.language.name === 'en' // Usando inglês como fallback
    );
    
    return portugueseEntry ? 
      portugueseEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 
      'Descrição não disponível.';
  }, [speciesData]);

  // Handlers para navegação
  const handlePrevious = useCallback(() => {
    onNavigate?.('prev');
  }, [onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate?.('next');
  }, [onNavigate]);

  // Handler para fechar
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handler para mudança de aba
  const handleTabChange = useCallback((tab: 'about' | 'stats' | 'evolution') => {
    setActiveTab(tab);
  }, []);

  // Handler para carregamento da imagem
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Renderização do estado de loading
  if (loading) {
    return (
      <div className={`${styles.pokemonDetails} ${styles.loading} ${className}`}>
        <Loading 
          message={`Carregando detalhes de ${pokemonName}...`}
          size="large"
        />
      </div>
    );
  }

  // Renderização do estado de erro
  if (error || !pokemonData) {
    return (
      <div className={`${styles.pokemonDetails} ${styles.error} ${className}`}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>😞</div>
          <h2 className={styles.errorTitle}>Oops!</h2>
          <p className={styles.errorMessage}>
            {error || 'Não foi possível carregar os detalhes do Pokémon.'}
          </p>
          <div className={styles.errorActions}>
            <button 
              className={styles.retryButton}
              onClick={loadPokemonData}
              type="button"
            >
              Tentar Novamente
            </button>
            {onClose && (
              <button 
                className={styles.closeButton}
                onClick={handleClose}
                type="button"
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.pokemonDetails} ${className}`}
      style={{
        '--primary-color': primaryColor,
        '--primary-color-light': `${primaryColor}20`,
        '--primary-color-dark': `${primaryColor}dd`
      } as React.CSSProperties}
      data-testid="pokemon-details"
      role="main"
    >
      {/* Header com navegação */}
      <div className={styles.header}>
        {onClose && (
          <button 
            className={styles.backButton}
            onClick={handleClose}
            aria-label="Voltar"
            type="button"
          >
            ←
          </button>
        )}
        
        <div className={styles.pokemonInfo}>
          <h1 className={styles.pokemonName}>
            {pokemonData.name}
          </h1>
          <span className={styles.pokemonNumber}>
            #{pokemonData.id.toString().padStart(3, '0')}
          </span>
        </div>
        
        {showNavigation && onNavigate && (
          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={handlePrevious}
              aria-label="Pokémon anterior"
              type="button"
            >
              ‹
            </button>
            <button 
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Próximo Pokémon"
              type="button"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Imagem principal */}
      <div className={styles.imageSection}>
        <div className={styles.imageContainer}>
          {!imageLoaded && (
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageLoader} />
            </div>
          )}
          <img
            src={pokemonData.sprites.other?.['official-artwork']?.front_default || pokemonData.sprites.front_default || ''}
            alt={pokemonData.name}
            className={`${styles.pokemonImage} ${imageLoaded ? styles.loaded : ''}`}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(true)}
          />
          <div className={styles.imageGlow} />
        </div>
        
        {/* Tipos */}
        <div className={styles.typesContainer}>
          {pokemonData.types.map((type, index) => (
            <span
              key={type.type.name}
              className={styles.typeTag}
              style={{
                backgroundColor: apiService.getTypeColor(type.type.name),
                animationDelay: `${index * 0.1}s`
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Navegação por abas */}
      <div className={styles.tabNavigation} role="tablist">
        <button
          className={`${styles.tabButton} ${activeTab === 'about' ? styles.active : ''}`}
          onClick={() => handleTabChange('about')}
          type="button"
          role="tab"
          aria-selected={activeTab === 'about'}
          aria-controls="about-panel"
        >
          Sobre
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'stats' ? styles.active : ''}`}
          onClick={() => handleTabChange('stats')}
          type="button"
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-controls="stats-panel"
        >
          Estatísticas
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'evolution' ? styles.active : ''}`}
          onClick={() => handleTabChange('evolution')}
          type="button"
          role="tab"
          aria-selected={activeTab === 'evolution'}
          aria-controls="evolution-panel"
        >
          Evolução
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className={styles.tabContent} role="tabpanel" id={`${activeTab}-panel`}>
        {activeTab === 'about' && (
          <div className={styles.aboutTab} data-testid="about-tab">
            <div className={styles.description}>
              <h3>Descrição</h3>
              <p>{pokemonDescription}</p>
            </div>
            
            <div className={styles.basicInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Altura</span>
                  <span className={styles.infoValue}>{formatHeight(pokemonData.height)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Peso</span>
                  <span className={styles.infoValue}>{formatWeight(pokemonData.weight)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Experiência Base</span>
                  <span className={styles.infoValue}>{pokemonData.base_experience}</span>
                </div>
                {speciesData?.habitat && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Habitat</span>
                    <span className={styles.infoValue}>{speciesData.habitat.name}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.abilitiesSection}>
                <h3>Habilidades</h3>
                <div className={styles.abilitiesList}>
                  {pokemonData.abilities.map((ability) => (
                    <span 
                      key={ability.ability.name}
                      className={`${styles.abilityTag} ${ability.is_hidden ? styles.hiddenAbility : ''}`}
                    >
                      {ability.ability.name.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      {ability.is_hidden && ' (Oculta)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className={styles.statsTab} data-testid="stats-tab">
            <div className={styles.statsContainer}>
              {processedStats.map((stat, index) => (
                <div 
                  key={stat.name} 
                  className={styles.statItem}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.statHeader}>
                    <span className={styles.statName}>{stat.name}</span>
                    <span className={styles.statValue}>{stat.value}</span>
                  </div>
                  <div className={styles.statBar}>
                    <div 
                      className={styles.statFill}
                      style={{
                        width: `${(stat.value / stat.maxValue) * 100}%`,
                        backgroundColor: stat.color,
                        animationDelay: `${index * 0.1 + 0.3}s`
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <div className={styles.totalStats}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{totalStats}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className={styles.evolutionTab} data-testid="evolution-tab">
            <div className={styles.evolutionPlaceholder}>
              <div className={styles.evolutionIcon}>🔄</div>
              <h3>Cadeia de Evolução</h3>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PokemonDetails);