import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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

  it("has the Formulario component as a child", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
