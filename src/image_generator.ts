// tslint:disable-next-line:no-var-requires
const plantuml = require("node-plantuml"); // there are no type definitions for this module :-(
import * as fs from "fs";
import * as path from "path";

/**
 * Generates local image files.
 */
export class ImageGenerator {
    /** The path to the folder into which the files are generated.  */
    private outputDirectory!: string;

    /** Prefix used for every image file. */
    private readonly fileNamePrefix = "umlClassDiagram-";

    /** Number of generated image files. */
    private numberOfGeneratedImages = 0;

    /**
     * Sets the output directory.
     * @param outputDirectory The path to the folder into which the files are generated.
     */
    public setOutputDirectory(outputDirectory: string): void {
        this.outputDirectory = outputDirectory;
    }

    /**
     * Writes a class diagram as a local image to the disc.
     * @param pageFilename The filename of the generated TypeDoc page.
     * @param encodedPlantUml The encoded PlantUML code for the diagram.
     * @returns The relative path to the generated image file.
     */
    public writeImage(pageFilename: string, encodedPlantUml: string, imageFormat: "svg" | "png"): string {
        // setup plantuml encoder and decoder
        const decode = plantuml.decode(encodedPlantUml);
        const gen = plantuml.generate({ format: imageFormat });

        // get image filename
        const filename = this.fileNamePrefix + ++this.numberOfGeneratedImages + "." + imageFormat;
        const imagePath = path.join(this.outputDirectory, filename);

        // decode and save png to assets directory
        decode.out.pipe(gen.in);
        gen.out.pipe(fs.createWriteStream(imagePath));

        // get relative path filename
        const currentDirectory = path.dirname(pageFilename);
        // return the relative path
        return path.relative(currentDirectory, imagePath);
    }
}
