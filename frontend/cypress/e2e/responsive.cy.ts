describe("Dashboard Responsive Layout", () => {
  it("renders on desktop", () => {
    cy.viewport(1440, 900);

    cy.visitDashboard();

    cy.get(".dashboard").should("be.visible");
    cy.get(".sidebar").should("be.visible");
  });

  it("renders on tablet", () => {
    cy.viewport(1024, 768);

    cy.visitDashboard();

    cy.get(".dashboard").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });

  it("renders on mobile", () => {
    cy.viewport(390, 844);

    cy.visitDashboard();

    cy.get(".dashboard").should("be.visible");
    cy.get(".main-content").should("be.visible");
  });
});