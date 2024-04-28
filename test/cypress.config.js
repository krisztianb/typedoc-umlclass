/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/unbound-method */
const { defineConfig } = require("cypress");
const { configureVisualRegression } = require("cypress-visual-regression/dist/plugin");

module.exports = defineConfig({
    e2e: {
        specPattern: "**/*.cy.ts",
        video: false,
        screenshotOnRunFailure: false,
        screenshotsFolder: "./cypress/snapshots/actual",
        env: {
            visualRegressionType: "regression",
        },
        setupNodeEvents(on) {
            configureVisualRegression(on);

            // Custom task for logging to the console. This is for debugging tests.
            on("task", {
                log(message) {
                    console.log(message);
                    // eslint-disable-next-line unicorn/no-null
                    return null;
                },
            });
        },
    },
});
