import { useState, useEffect } from 'react';
import { PokemonListItem, Pokemon, POKEMON_TYPE_COLORS } from 'types/pokemon';
import PokemonApiService from 'services/pokemonApi';
import Loading from 'components/Loading';
import styles from './PokemonCard.module.scss';

interface PokemonCardProps {
  pokemonItem: PokemonListItem;
  onClick?: (pokemon: Pokemon) => void;
  isSelected?: boolean;
}

export default function PokemonCard({ 
  pokemonItem, 
  onClick, 
  isSelected = false 
}: PokemonCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const pokemonId = pokemonItem?.url ? PokemonApiService.extractPokemonId(pokemonItem.url) : 0;

  useEffect(() => {
    if (!pokemonItem?.url || pokemonId === 0) {
      setLoading(false);
      return;
    }

    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const pokemonData = await PokemonApiService.getPokemonDetails(pokemonId);
        setPokemon(pokemonData);
      } catch (err) {
        setError('Erro ao carregar Pokémon');
        console.error('Erro ao buscar detalhes do Pokémon:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId, pokemonItem?.url]);

  const handleCardClick = () => {
    if (pokemon && onClick) {
      onClick(pokemon);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getPrimaryType = () => {
    return pokemon?.types[0]?.type.name || 'normal';
  };

  const getTypeColor = (typeName: string) => {
    return POKEMON_TYPE_COLORS[typeName] || POKEMON_TYPE_COLORS.normal;
  };

  const getImageUrl = () => {
    if (!pokemon) return '';
    
    // Prioriza a imagem oficial da artwork
    const officialArtwork = pokemon.sprites.other?.['official-artwork']?.front_default;
    if (officialArtwork) return officialArtwork;
    
    // Fallback para sprite padrão
    return pokemon.sprites.front_default || '';
  };

  if (loading) {
    return (
      <div className={styles.pokemonCard}>
        <Loading size="small" message="" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={`${styles.pokemonCard} ${styles.error}`}>
        <div className={styles.errorContent}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorMessage}>Erro ao carregar</p>
        </div>
      </div>
    );
  }

  const primaryType = getPrimaryType();
  const typeColor = getTypeColor(primaryType);

  return (
    <article 
      className={`${styles.pokemonCard} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
      style={{
        '--primary-type-color': typeColor,
        '--primary-type-color-light': `${typeColor}20`,
      } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Ver detalhes de ${PokemonApiService.formatPokemonName(pokemon.name)}`}
    >
      <div className={styles.cardHeader}>
        <span className={styles.pokemonNumber}>
          {PokemonApiService.formatPokemonNumber(pokemon.id)}
        </span>
      </div>

      <div className={styles.imageContainer}>
        {imageLoading && (
          <div className={styles.imagePlaceholder}>
            <div className={styles.imageLoader}></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={getImageUrl()}
            alt={PokemonApiService.formatPokemonName(pokemon.name)}
            className={`${styles.pokemonImage} ${imageLoading ? styles.hidden : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className={styles.imageError}>
            <span className={styles.imageErrorIcon}>🔍</span>
            <p>Imagem não encontrada</p>
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.pokemonName}>
          {PokemonApiService.formatPokemonName(pokemon.name)}
        </h3>

        <div className={styles.pokemonTypes}>
          {pokemon.types.map((typeInfo, index) => (
            <span
              key={index}
              className={styles.typeTag}
              style={{
                backgroundColor: getTypeColor(typeInfo.type.name),
              }}
            >
              {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.pokemonStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Altura</span>
            <span className={styles.statValue}>
              {PokemonApiService.formatHeight(pokemon.height)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Peso</span>
            <span className={styles.statValue}>
              {PokemonApiService.formatWeight(pokemon.weight)}
            </span>
          </div>
        </div>
      </div>

      {/* Efeito de brilho no hover */}
      <div className={styles.cardGlow}></div>
    </article>
  );
}