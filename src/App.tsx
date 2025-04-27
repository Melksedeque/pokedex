import pokemonLogo from "@/public/images/international_Pokémon_logo.svg";

function App() {
  return (
    <>
      <div>
        <a href="/" title="Pokédex">
          <img src={pokemonLogo} className="logo" alt="Pokémon logo" />
        </a>
      </div>
      <h1>Pokédex</h1>
    </>
  );
}

export default App;
