// tslint:disable-next-line:no-var-requires
const plantuml = require("node-plantuml"); // there are no type definitions for this module :-(

/**
 * Class for generating a diagram from PlantUML code.
 */
export class PlantUmlDiagramGenerator {
    /**
     * Promises to write a diagram as an image into a buffer.
     * @param plantUml The PlantUML code for the diagram.
     * @param imageFormat The format of the image to generate. (eg.: "png" or "svg")
     * @returns The promise of a buffer including the image of the diagram.
     */
    public generateFromCode(plantUml: string, imageFormat: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks = new Array<Buffer>();
            const gen = plantuml.generate(plantUml, { format: imageFormat });

            gen.out.on("data", (chunk: Buffer) => chunks.push(chunk));
            gen.out.on("error", (e: Error) => reject(e));
            gen.out.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }
}
