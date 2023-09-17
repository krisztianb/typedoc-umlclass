/// <reference types="cypress" />
import { diagramSelector } from "../cypress/support/constants";

describe("classes/super.Super.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/super.Super.html");
    });

    it("has a local class diagram image in the PNG format", () => {
        cy.get(diagramSelector).find("img").should("have.attr", "src").and("include", ".png");
    });
});

describe("classes/sub.Sub.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/sub.Sub.html");
    });

    it("has a local class diagram image in the PNG format", () => {
        cy.get(diagramSelector).find("img").should("have.attr", "src").and("include", ".png");
    });
});
