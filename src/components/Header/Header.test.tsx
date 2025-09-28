import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./index";

// Props padrão para os testes
const defaultProps = {
  onFilterChange: jest.fn(),
  onSortChange: jest.fn(),
  onSearchChange: jest.fn(),
  currentFilters: {
    types: [],
    numberRange: { min: 1, max: 1010 }
  },
  currentSort: { label: 'Número (Crescente)', value: 'id' as const },
  currentSearch: '',
  searchTerm: '',
  isLoading: false
};

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<Header {...defaultProps} />);
  });

  it("renders correctly", () => {
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("displays the Pokéball image", () => {
    expect(screen.getByAltText("Pokéball")).toBeInTheDocument();
  });

  it("displays the Pokédex title", () => {
    expect(screen.getByRole("heading", { name: /pokédex/i })).toBeDefined();
  });

  it("has the PokemonFilters component as a child", () => {
    // Verifica se os elementos de filtro estão presentes
    expect(screen.getByPlaceholderText(/buscar pokémon/i)).toBeInTheDocument();
  });
});
