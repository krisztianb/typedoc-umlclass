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
     * @param encodedPlantUml The encoded PlantUML code for the image.
     * @param imageName The name of the class diagram.
     * @param imageFormat The format of the image to generate. (eg.: "png" or "svg")
     * @returns Absolute path to the written file.
     */
    public writeImageFile(encodedPlantUml: string, imageName: string, imageFormat: string): string {
        const filename = this.createFilenameForNextImage(imageName, imageFormat);
        const absoluteFilename = path.join(this.outputDirectory, filename);

        const decode = plantuml.decode(encodedPlantUml);
        const gen = plantuml.generate({ format: imageFormat });

        decode.out.pipe(gen.in);
        gen.out.pipe(fs.createWriteStream(absoluteFilename));

        ++this.numberOfGeneratedImages;

        return absoluteFilename;
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
