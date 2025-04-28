import { render, screen } from "@testing-library/react";
import Header from "./index";

describe("Header Component", () => {
  beforeEach(() => {
    render(<Header />);
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

  it("includes the search form", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar Pokémon")).toBeInTheDocument();
  });

  it("includes the filter button", () => {
    expect(screen.getByRole("button", { name: /#/i })).toBeInTheDocument();
  });
});
