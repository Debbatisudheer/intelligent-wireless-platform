describe("Real-Time Dashboard", () => {
  beforeEach(() => {
    cy.visitDashboard("/realtime");
  });

  it("loads the realtime dashboard", () => {
    cy.contains("Real-Time").should("be.visible");
  });

  it("renders the dashboard shell", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });

  it("does not crash when realtime data is unavailable", () => {
    cy.get("body").should("be.visible");

    cy.get("body").should(
      "not.contain",
      "Application Error",
    );
  });
});