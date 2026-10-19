declare global {
  namespace Cypress {
    interface Chainable {
      visitDashboard(path?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "visitDashboard",
  (path = "/") => {
    cy.visit(path);
  },
);

export {};