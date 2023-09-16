/// <reference types="cypress" />
import { diagramSelector } from "../cypress/support/constants";

describe("classes/super.Super.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/super.Super.html");
    });

    it("has a class diagram in the PNG format", () => {
        cy.get(diagramSelector).find("a").should("have.attr", "href").and("include", ".png");
    });
});

describe("classes/sub.Sub.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/sub.Sub.html");
    });

    it("has a class diagram in the PNG format", () => {
        cy.get(diagramSelector).find("a").should("have.attr", "href").and("include", ".png");
    });
});
