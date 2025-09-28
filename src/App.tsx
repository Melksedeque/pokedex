import { useState } from 'react';
import { PokemonListItem, SortOption } from 'types/pokemon';
import PokemonList from 'components/PokemonList';
import PokemonDetails from 'components/PokemonDetails';
import Header from 'components/Header';
import { FilterState } from 'components/PokemonFilters';
import './App.css';

type AppView = 'list' | 'details';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonListItem | null>(null);
  
  // Estados dos filtros centralizados no App
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    numberRange: { min: 1, max: 1010 }
  });
  const [sortBy, setSortBy] = useState<SortOption>({ label: 'Número (Crescente)', value: 'id' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Handlers para os filtros
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
  };

  return (
    <div className="app">
      <Header 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        currentFilters={filters}
        currentSort={sortBy}
        currentSearch={searchTerm}
        isLoading={isLoading}
      />
      
      <main className="main-content">
        {currentView === 'list' ? (
          <PokemonList 
            onPokemonSelect={handlePokemonSelect}
            className="pokemon-list-container"
            // Passando os filtros para o PokemonList
            filters={filters}
            sortBy={sortBy}
            searchTerm={searchTerm}
            onLoadingChange={setIsLoading}
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
