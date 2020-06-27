import { DiagramLegend } from "./diagram_legend";

/**
 * Class for generating diagram legends.
 */
export class DiagramLegendGenerator {
    /**
     * Creates a legend for the given PlantUML code.
     * @param plantUml The PlantUML lines of code for which the legend is generated.
     * @returns The legend for the PlantUML code.
     */
    public static createForPlantUmlLines(plantUml: string[]): DiagramLegend {
        // Check for a trailing "{" too to distinguish between a dummy type and a real class
        const hasClassItem = plantUml.some((str) => str.startsWith("class ") && str.endsWith("{"));
        const hasAbstractClassItem = plantUml.some((str) => str.startsWith("abstract "));
        const hasInterfaceItem = plantUml.some((str) => str.startsWith("interface "));
        const hasPublicPropertyItem = plantUml.some((str) => / \+\w+ : /.test(str));
        const hasProtectedPropertyItem = plantUml.some((str) => / \#\w+ : /.test(str));
        const hasPrivatePropertyItem = plantUml.some((str) => / \-\w+ : /.test(str));
        const hasPublicMethodItem = plantUml.some((str) => / \+\w+\(/.test(str));
        const hasProtectedMethodItem = plantUml.some((str) => / \#\w+\(/.test(str));
        const hasPrivateMethodItem = plantUml.some((str) => / \-\w+\(/.test(str));
        const hasStaticMemberItem = plantUml.some((str) => str.indexOf("{static}") !== -1);
        const hasAbstractMemberItem = plantUml.some((str) => str.indexOf("{abstract}") !== -1);

        return new DiagramLegend(
            hasClassItem,
            hasAbstractClassItem,
            hasInterfaceItem,
            hasPublicPropertyItem,
            hasProtectedPropertyItem,
            hasPrivatePropertyItem,
            hasPublicMethodItem,
            hasProtectedMethodItem,
            hasPrivateMethodItem,
            hasStaticMemberItem,
            hasAbstractMemberItem
        );
    }
}
