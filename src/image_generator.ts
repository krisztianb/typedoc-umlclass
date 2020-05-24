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

    /** Stamp used for every image file. */
    private readonly fileNameStamp = "umlClassDiagram";

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
     * @param plantUml The PlantUML code for the image.
     * @param imageName The name of the class diagram.
     * @param imageFormat The format of the image to generate. (eg.: "png" or "svg")
     * @returns Absolute path to the written file.
     */
    public writeImageToFile(plantUml: string, imageName: string, imageFormat: string): string {
        const filename = this.createFilenameForNextImage(imageName, imageFormat);
        const absoluteFilename = path.join(this.outputDirectory, filename);

        const gen = plantuml.generate(plantUml, { format: imageFormat });
        gen.out.pipe(fs.createWriteStream(absoluteFilename));

        ++this.numberOfGeneratedImages;

        return absoluteFilename;
    }

    /**
     * Promises to write a class diagram as an image into a buffer.
     * @param plantUml The PlantUML code for the image.
     * @param imageFormat The format of the image to generate. (eg.: "png" or "svg")
     * @returns The promise of a buffer including the image of the class diagram.
     */
    public writeImageToBuffer(plantUml: string, imageFormat: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks = new Array<Buffer>();
            const gen = plantuml.generate(plantUml, { format: imageFormat });

            gen.out.on("data", (chunk: Buffer) => chunks.push(chunk));
            gen.out.on("error", (e: Error) => reject(e));
            gen.out.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }

    /**
     * Returns the PlantUML website URL that generates a UML diagram.
     * @param encodedPlantUml The encoded PlantUML for the diagram.
     * @param imageFormat The format of the image the URL should generate. (eg.: "png" or "svg")
     * @returns The URL that generates the diagram.
     */
    public createPlantUmlServerUrl(encodedPlantUml: string, imageFormat: string): string {
        return "http://www.plantuml.com/plantuml/" + imageFormat + "/" + encodedPlantUml;
    }

    /**
     * Creates a filename for the next image.
     * @param imageName A name of the thing visible on the image.
     * @param fileExtension Extension used in the filename.
     * @returns The generated filename.
     */
    private createFilenameForNextImage(imageName: string, fileExtension: string): string {
        return imageName + "-" + this.fileNameStamp + "-" + this.numberOfGeneratedImages + "." + fileExtension;
    }
}
