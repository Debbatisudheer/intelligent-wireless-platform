describe("Wireless Analytics", () => {
  beforeEach(() => {
    cy.visitDashboard("/analytics");
  });

  it("loads analytics", () => {
    cy.contains("Analytics").should("be.visible");
  });

  it("renders the main dashboard shell", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });

  it("does not show an application error", () => {
    cy.get("body").should(
      "not.contain",
      "Application Error",
    );
  });
});