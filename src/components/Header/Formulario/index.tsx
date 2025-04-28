import styles from "./Formulario.module.scss";

export default function Formulario() {
  return (
    <section className={styles.buscarPokemon}>
      <form className={styles.formBusca}>
        <div className={styles.inputGroup}>
          <span className={styles.inputAddon}>Buscar</span>
          <input type="text" placeholder="Buscar Pokémon" />
        </div>
      </form>
      <div className={styles.filter}>
        <button>#</button>
      </div>
    </section>
  );
}
