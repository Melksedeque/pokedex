import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Formulario from "./index";

describe("Formulario Component", () => {
  beforeEach(() => {
    render(<Formulario />);
  });

  it("renders correctly", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("displays the search input", () => {
    expect(screen.getByPlaceholderText("Buscar Pokémon")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeVisible();
  });

  it("displays the magnifying glass icon", () => {
    // This depends on how your SVG is implemented
    // If it has a test-id:
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    // Or if it's part of a specific class:
    expect(document.querySelector(".inputAddon svg")).toBeInTheDocument();
  });

  it("displays the filter button", () => {
    expect(screen.getByRole("button", { name: /#/i })).toBeInTheDocument();
  });

  it("has the correct form structure", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(document.querySelector(".inputGroup")).toBeInTheDocument();
    expect(document.querySelector(".filter")).toBeInTheDocument();
  });

  it("allows typing in the search input", async () => {
    const searchText = "Pikachu";
    const input = screen.getByPlaceholderText("Buscar Pokémon");

    await userEvent.type(input, searchText);
    expect(input).toHaveValue(searchText);
  });

  it("submits the form with input value", async () => {
    const mockSubmit = jest.fn();
    const { container } = render(<Formulario onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Buscar Pokémon");
    const form = screen.getByRole("form");

    await userEvent.type(input, "Charizard");
    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
