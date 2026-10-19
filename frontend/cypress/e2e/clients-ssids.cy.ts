describe("Clients and SSIDs", () => {
  it("loads the clients page", () => {
    cy.visitDashboard("/clients");

    cy.contains("Clients").should("be.visible");
  });

  it("loads the SSIDs page", () => {
    cy.visitDashboard("/ssids");

    cy.contains("SSIDs").should("be.visible");
  });

  it("can navigate from clients to SSIDs", () => {
    cy.visitDashboard("/clients");

    cy.contains("SSIDs").click();

    cy.url().should("include", "/ssids");
  });
});