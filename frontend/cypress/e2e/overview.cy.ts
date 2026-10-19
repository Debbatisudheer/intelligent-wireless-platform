describe("Overview Dashboard", () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it("renders the overview dashboard", () => {
    cy.contains("Overview").should("be.visible");
  });

  it("loads the dashboard without an application error", () => {
    cy.get("body").should("be.visible");

    cy.get("body").should(
      "not.contain",
      "Application Error",
    );
  });

  it("keeps the dashboard shell visible", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });
});