import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./Formulario.module.scss";

export default function Formulario() {
  return (
    <section className={styles.buscarPokemon}>
      <form role="form" className={styles.formBusca} data-testid="search-form">
        <div className={styles.inputGroup} data-testid="search-inputContainer">
          <span className={styles.inputAddon} data-testid="search-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            placeholder="Buscar Pokémon"
            data-testid="search-input"
          />
        </div>
      </form>
      <div className={styles.filter} data-testid="search-filter">
        <button>#</button>
      </div>
    </section>
  );
}
