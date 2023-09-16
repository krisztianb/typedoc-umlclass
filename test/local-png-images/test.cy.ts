/// <reference types="cypress" />
import { contentSelector } from "../cypress/support/constants";

describe("classes/super.Super.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/super.Super.html");
    });

    it("has a class diagram in the PNG format", () => {
        cy.contains(contentSelector, "TODO"); // TODO
    });
});

describe("classes/sub.Sub.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/sub.Sub.html");
    });

    it("has a class diagram in the PNG format", () => {
        cy.contains(contentSelector, "TODO"); // TODO
    });
});
