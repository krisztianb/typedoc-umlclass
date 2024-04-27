/// <reference types="cypress" />
import { chaiImage } from "chai-image";
import * as fs from "fs";
import * as path from "path";
import { diagramSelector } from "../cypress/support/constants";

chai.use(chaiImage);

describe("classes/super.Super.html", () => {
    beforeEach(() => {
        cy.visit("./local-png-images/output/classes/super.Super.html");
    });

    it("has a PNG image with the expected data", () => {
        cy.get(diagramSelector)
            .find("img")
            .first()
            .then((image) => {
                // maybe use this package: https://www.npmjs.com/package/cypress-fs
                const newImageFileName = path.basename(image.attr("src") ?? "");
                const newImageFile = fs.readFileSync(path.join("./output/assets/", newImageFileName));
                const expectedImageFile = fs.readFileSync("./fixtures/Super.png");

                expect(newImageFile).to.matchImage(expectedImageFile);
            });
    });
});
