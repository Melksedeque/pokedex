import pokemonLogo from "./assets/images/International_Pokémon_logo.svg";
import pokeball from "./assets/images/Pokéball.svg";

function App() {
  return (
    <>
      <div>
        <a href="/" title="Pokédex">
          <img src={pokemonLogo} className="logo" alt="Pokémon logo" />
        </a>
      </div>
      <h1>
        <img src={pokeball} alt="Pokéball" />
        Pokédex
      </h1>
    </>
  );
}

export default App;
