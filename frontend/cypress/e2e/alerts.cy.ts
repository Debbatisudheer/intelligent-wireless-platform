describe("Alerts and Incidents", () => {
  beforeEach(() => {
    cy.visitDashboard("/alerts");
  });

  it("loads the alerts dashboard", () => {
    cy.contains("Alerts").should("be.visible");
  });

  it("renders the dashboard shell", () => {
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