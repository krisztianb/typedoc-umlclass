/* eslint-disable unicorn/no-abusive-eslint-disable */
/// <reference types="cypress" />
import { diagramSelector } from "../cypress/support/constants";

describe("classes/super.Super.html", () => {
    beforeEach(() => {
        const pageUrl = "/style-options/output/classes/super.Super.html";

        // remove script tags from page because they modify the HTML view
        cy.intercept(pageUrl, (req) => {
            req.continue((res) => {
                const scriptTags = /<script[^<]*<\/script>/gi;
                /* eslint-disable -- Too many errors for one line */
                res.body = res.body.replace(scriptTags, "");
                /* eslint-enable */
            });
        });

        cy.visit(pageUrl);

        // hide stickily positioned page header because it messes up the cypress screenshot captures
        cy.get("header").invoke("attr", "style", "display:none;");
    });

    it("has an image with the expected content", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Missing type information for compareSnapshot
        cy.get(diagramSelector).find("img").first().compareSnapshot("Super.HierarchyDiagram");
    });
});
