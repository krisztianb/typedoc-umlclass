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
     * Writes a buffer of image data as a local file to the disc.
     * @param imageData The image data buffer.
     * @param imageName The name of the class diagram.
     * @param imageFormat The format of the image to generate. (eg.: "png" or "svg")
     * @returns Absolute path to the written file.
     */
    public writeImageToFile(imageData: Buffer, imageName: string, imageFormat: string): string {
        const filename = this.createFilenameForNextImage(imageName, imageFormat);
        const absoluteFilename = path.join(this.outputDirectory, filename);

        fs.writeFileSync(absoluteFilename, imageData);

        ++this.numberOfGeneratedImages;

        return absoluteFilename;
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
