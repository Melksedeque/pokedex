import Header from "./index";
import { mount } from "cypress/react";

describe("Header Component", () => {
  beforeEach(() => {
    mount(<Header />);
  });

  it("renders correctly", () => {
    cy.get("header").should("exist");
  });

  it("displays the Pokéball image", () => {
    cy.get('img[alt="Pokéball"]').should("be.visible");
  });

  it("displays the Pokédex title", () => {
    cy.get("h1").should("contain.text", "Pokédex");
  });

  it("includes the search form", () => {
    cy.get("form").should("exist");
    cy.get('input[placeholder="Buscar Pokémon"]').should("exist");
  });

  it("includes the filter button", () => {
    cy.get("button").should("contain.text", "#");
  });
});
