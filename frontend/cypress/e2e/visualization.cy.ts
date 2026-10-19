describe("Network Visualization", () => {
  beforeEach(() => {
    cy.visitDashboard("/visualization");
  });

  it("loads the network visualization page", () => {
    cy.contains("Visualization").should("be.visible");
  });

  it("renders the visualization area", () => {
    cy.get(".network-topology").should("be.visible");
  });

  it("renders the dashboard shell", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });
});