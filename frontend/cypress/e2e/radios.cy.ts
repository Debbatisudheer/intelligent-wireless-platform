describe("Radios", () => {
  beforeEach(() => {
    cy.visitDashboard("/radios");
  });

  it("loads the radios page", () => {
    cy.contains("Radios").should("be.visible");
  });

  it("renders the dashboard shell", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });
});