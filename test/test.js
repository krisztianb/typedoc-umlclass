import { execSync } from "node:child_process";

console.log("======================================== LOCAL PNG IMAGES =========================================");
execSync("npx typedoc --options local-png-images/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'local-png-images/test.cy.ts'", { stdio: "inherit" });

console.log("======================================== LOCAL SVG IMAGES =========================================");
execSync("npx typedoc --options local-svg-images/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'local-svg-images/test.cy.ts'", { stdio: "inherit" });

console.log("====================================== EMBEDDED SVG IMAGES ========================================");
execSync("npx typedoc --options embed-svg-images/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'embed-svg-images/test.cy.ts'", { stdio: "inherit" });

console.log("======================================= REMOTE SVG IMAGES =========================================");
execSync("npx typedoc --options remote-svg-images/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'remote-svg-images/test.cy.ts'", { stdio: "inherit" });

console.log("========================================= STYLE OPTIONS ===========================================");
execSync("npx typedoc --options style-options/typedoc.config.cjs", { stdio: "inherit" });
execSync("npx cypress run --quiet --spec 'style-options/test.cy.ts'", { stdio: "inherit" });

console.log("============================================ FINISHED =============================================");
