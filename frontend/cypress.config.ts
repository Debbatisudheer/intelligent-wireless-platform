import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",

    specPattern: "cypress/e2e/**/*.cy.ts",

    supportFile: "cypress/support/e2e.ts",

    video: false,

    screenshotOnRunFailure: true,

    viewportWidth: 1440,

    viewportHeight: 900,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      return config;
    },
  },
});