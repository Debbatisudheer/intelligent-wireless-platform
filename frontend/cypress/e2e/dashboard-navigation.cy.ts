describe("Dashboard Navigation", () => {
  it("loads the overview page", () => {
    cy.visitDashboard();

    cy.url().should("eq", "http://localhost:5173/");

    cy.contains("Overview").should("be.visible");
  });

  it("navigates through the main dashboard sections", () => {
    cy.visitDashboard();

    cy.contains("Access Points").click();
    cy.url().should("include", "/access-points");

    cy.contains("Radios").click();
    cy.url().should("include", "/radios");

    cy.contains("Clients").click();
    cy.url().should("include", "/clients");

    cy.contains("SSIDs").click();
    cy.url().should("include", "/ssids");

    cy.contains("Analytics").click();
    cy.url().should("include", "/analytics");

    cy.contains("Real-Time").click();
    cy.url().should("include", "/realtime");

    cy.contains("Visualization").click();
    cy.url().should("include", "/visualization");

    cy.contains("Alerts").click();
    cy.url().should("include", "/alerts");
  });
});