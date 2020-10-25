import * as path from "path";
import * as plantUmlEncoder from "plantuml-encoder";

/**
 * Creates a URL to a local image file.
 * @param pageFilePath Path of the page that is referencing the image.
 * @param imageFilePath Path to the local image file.
 * @returns The URL to the local image file.
 */
export function createLocalImageFileUrl(pageFilePath: string, imageFilePath: string): string {
    const pageFileDir = path.dirname(pageFilePath);
    return path.relative(pageFileDir, imageFilePath);
}

/**
 * Creates a URL for an embedded image.
 * @param imageData The data of the image.
 * @param imageFormat The format of the image data.
 * @returns The URL for the embedded image.
 */
export function createEmbeddedImageUrl(imageData: Readonly<Buffer>, imageFormat: string): string {
    const mimeType = imageFormat === "png" ? "image/png" : "image/svg+xml";
    return "data:" + mimeType + ";base64," + imageData.toString("base64");
}

/**
 * Creates a PlantUML server URL that generates an image.
 * @param plantUmlCode The PlantUML code for the image.
 * @param imageFormat The format for the image.
 * @returns The PlantUML server URL for the image.
 */
export function createPlantUmlServerUrl(plantUmlCode: string, imageFormat: string): string {
    const encodedPlantUml = plantUmlEncoder.encode(plantUmlCode);
    return "http://www.plantuml.com/plantuml/" + imageFormat + "/" + encodedPlantUml;
}
