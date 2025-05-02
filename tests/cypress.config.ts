
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{feature,features}",
    supportFile: "cypress/support/e2e.js",
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler); 
      (config as any).stepDefinitions = [
        "cypress/e2e/step_definitions/**/*.{js,ts}",
        "cypress/e2e/**/*.steps.{js,ts}"
      ];

      return config;
    },
  },
});
