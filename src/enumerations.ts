/**
 * Supported class diagram types when automatically generating class diagrams.
 */
export enum ClassDiagramType {
    None = 1,
    Simple = 2,
    Detailed = 3,
}

/**
 * Supported visibility styles for members when automatically generating class diagrams.
 */
export enum ClassDiagramMemberVisibilityStyle {
    Text = 1,
    Icon = 2,
}

/**
 * Font styles supported by PlantUML.
 */
export const enum FontStyle {
    Undefined = "",
    Normal = "normal",
    Plain = "plain",
    Italic = "italic",
    Bold = "bold",
}
