/**
 * Class with utility functions regarding PlantUML code.
 */
export class PlantUmlUtils {
    /** URL to the PlantUML web page, where one can generate UML diagrams. */
    public static readonly plantUmlServerUrl = "http://www.plantuml.com/plantuml/";

    /**
     * Returns the PlantUML website URL that generates a UML diagram.
     * @param encodedPlantUml The encoded PlantUML for the diagram.
     * @param imageFormat The format of the image the URL should generate. (eg.: "png" or "svg")
     * @returns The URL that generates the diagram.
     */
    public static createPlantUmlServerUrl(encodedPlantUml: string, imageFormat: string): string {
        return PlantUmlUtils.plantUmlServerUrl + imageFormat + "/" + encodedPlantUml;
    }
}
