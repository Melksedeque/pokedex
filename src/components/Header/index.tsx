import pokeball from "@/src/assets/images/Pokéball.svg";
import styles from "./Header.module.scss";
import Formulario from "./Formulario";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.appTitle}>
        <img src={pokeball} alt="Pokéball" />
        Pokédex
      </h1>
      <Formulario />
    </header>
  );
}
