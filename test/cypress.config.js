import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression/dist/plugin";

const config = defineConfig({
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

export default config;
