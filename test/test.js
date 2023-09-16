/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require("child_process");
const fs = require("fs");

console.log("=================================== SETTING UP THE TESTS ===========================================");

if (!fs.existsSync("..\\dist")) {
    console.error("ERROR: Cannot find 'dist' folder. Did you forget to build the plugin with 'npm run build'?");
    process.exit(1);
}

console.log("Copying current build of plugin to node_modules for testing...");

fs.rm("..\\node_modules\\typedoc-umlclass", { recursive: true, force: true });
fs.mkdirSync("..\\node_modules\\typedoc-umlclass\\dist", { recursive: true });
fs.copyFileSync("..\\package.json", "..\\node_modules\\typedoc-umlclass\\package.json");
fs.cpSync("..\\dist", "..\\node_modules\\typedoc-umlclass\\dist", { recursive: true });

console.log("DONE\n");

console.log("==================================== LOCAL PNG IMAGES ==============================================");
execSync("npx typedoc --options local-png-images/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'local-png-images/test.cy.ts'", { stdio: "inherit" });

console.log("======================================== FINISHED ==================================================");
