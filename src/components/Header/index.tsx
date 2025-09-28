import pokeball from "assets/images/Pokéball.svg";
import styles from "./Header.module.scss";
import PokemonFilters, { FilterState } from "../PokemonFilters";
import { SortOption } from "../../types/pokemon";

interface HeaderProps {
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (search: string) => void;
  currentFilters: FilterState;
  currentSort: SortOption;
  currentSearch: string;
  isLoading?: boolean;
}

export default function Header({
  onFilterChange,
  onSortChange,
  onSearchChange,
  currentFilters,
  currentSort,
  currentSearch,
  isLoading
}: HeaderProps) {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.appTitle}>
          <img src={pokeball} alt="Pokéball" />
          Pokédex
        </h1>
        
        <div className={styles.filtersSection}>
          <PokemonFilters
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onSearchChange={onSearchChange}
            currentFilters={currentFilters}
            currentSort={currentSort}
            currentSearch={currentSearch}
            isLoading={isLoading}
          />
        </div>
      </div>
    </header>
  );
}
