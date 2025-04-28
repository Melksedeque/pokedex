import Formulario from "./index";
import { mount } from "cypress/react";

describe("Formulario Component", () => {
  beforeEach(() => {
    mount(<Formulario />);
  });

  it("renders correctly", () => {
    cy.get("section").should("exist");
  });

  it("displays the search input", () => {
    cy.get('input[type="text"]').should("exist");
    cy.get('input[placeholder="Buscar Pokémon"]').should("be.visible");
  });

  it("displays the magnifying glass icon", () => {
    cy.get(".inputAddon svg").should("exist");
  });

  it("displays the filter button", () => {
    cy.get("button").should("exist");
    cy.get("button").should("contain.text", "#");
  });

  it("has the correct form structure", () => {
    cy.get("form").should("exist");
    cy.get(".inputGroup").should("exist");
    cy.get(".filter").should("exist");
  });

  it("allows typing in the search input", () => {
    const searchText = "Pikachu";
    cy.get('input[placeholder="Buscar Pokémon"]')
      .type(searchText)
      .should("have.value", searchText);
  });
});
