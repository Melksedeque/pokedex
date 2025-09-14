import pokemonLogo from 'assets/images/International_Pokémon_logo.svg';
import pokeball from 'assets/images/Pokéball.svg';
import styles from './Loading.module.scss';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Loading({ 
  message = 'Carregando...', 
  size = 'medium' 
}: LoadingProps) {
  return (
    <div className={`${styles.loadingContainer} ${styles[size]}`}>
      <div className={styles.logoContainer}>
        <img 
          src={pokemonLogo} 
          alt="Pokémon Logo" 
          className={styles.pokemonLogo}
        />
      </div>
      
      <div className={styles.pokeballContainer}>
        <img 
          src={pokeball} 
          alt="Pokéball" 
          className={styles.pokeball}
        />
      </div>
      
      <p className={styles.loadingMessage}>{message}</p>
      
      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
}