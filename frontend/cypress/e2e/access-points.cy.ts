describe("Access Points", () => {
  beforeEach(() => {
    cy.visitDashboard("/access-points");
  });

  it("loads the access point page", () => {
    cy.contains("Access Points").should("be.visible");
  });

  it("renders access point content", () => {
    cy.get("body").should("be.visible");
  });

  it("does not display an application error", () => {
    cy.get("body").should(
      "not.contain",
      "Application Error",
    );
  });
});