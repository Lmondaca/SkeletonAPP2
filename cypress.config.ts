import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:4200",
    // Los componentes de Ionic (ion-input, ion-button, etc.) renderizan su
    // contenido dentro de Shadow DOM; sin esto cy.get() no podría verlos.
    includeShadowDom: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
