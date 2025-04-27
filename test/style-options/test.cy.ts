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

        // Inject CSS to hide elements that interfere with the screenshot capture
        cy.document().then((doc) => {
            const style = doc.createElement("style");
            style.innerHTML = `
                header, section, aside, details {
                  display: none !important;
                }
                section.tsd-hierarchy-diagram {
                  display: block !important;
                }
            `;
            doc.head.appendChild(style);
        });
    });

    it("has an image with the expected content", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Missing type information for compareSnapshot
        cy.get(diagramSelector).find("img").first().compareSnapshot("Super.HierarchyDiagram");
    });
});
