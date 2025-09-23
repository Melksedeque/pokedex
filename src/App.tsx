import { useState } from 'react';
import { PokemonListItem } from 'types/pokemon';
import PokemonList from 'components/PokemonList';
import PokemonDetails from 'components/PokemonDetails';
import Header from 'components/Header';
import './App.css';

type AppView = 'list' | 'details';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);

  const handlePokemonSelect = (pokemon: PokemonListItem) => {
    setSelectedPokemon(pokemon);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPokemon(null);
  };

  const extractIdFromUrl = (url: string): string => {
    const match = url.match(/\/pokemon\/(\d+)\//); 
    return match ? match[1] : '1';
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {currentView === 'list' ? (
          <PokemonList 
            onPokemonSelect={handlePokemonSelect}
            className="pokemon-list-container"
          />
        ) : (
          selectedPokemon && (
            <PokemonDetails 
              pokemon={extractIdFromUrl(selectedPokemon.url).toString()}
              onClose={handleBackToList}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;
