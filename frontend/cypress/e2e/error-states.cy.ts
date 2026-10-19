describe("Dashboard Error States", () => {
  it("handles an unavailable access point API", () => {
    cy.intercept(
      "GET",
      "**/api/v1/access_points*",
      {
        statusCode: 500,
        body: {
          error: {
            code: "INTERNAL_ERROR",
            message: "Access point service unavailable",
          },
        },
      },
    ).as("accessPointsFailure");

    cy.visitDashboard("/access-points");

    cy.wait("@accessPointsFailure");

    cy.get("body").should("be.visible");
  });

  it("handles an unavailable alerts API", () => {
    cy.intercept(
      "GET",
      "**/api/v1/alerts*",
      {
        statusCode: 500,
        body: {
          error: {
            code: "INTERNAL_ERROR",
            message: "Alert service unavailable",
          },
        },
      },
    ).as("alertsFailure");

    cy.visitDashboard("/alerts");

    cy.wait("@alertsFailure");

    cy.get("body").should("be.visible");
  });
});