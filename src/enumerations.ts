/**
 * Supported class diagram types.
 */
export enum ClassDiagramType {
    None = 1,
    Simple = 2,
    Detailed = 3,
}

/**
 * Supported visibility styles for members in the class diagram.
 */
export const enum ClassDiagramMemberVisibilityStyle {
    Text = "text",
    Icon = "icon",
}

/**
 * Font styles supported by PlantUML.
 */
export const enum FontStyle {
    Default = "",
    Normal = "normal",
    Plain = "plain",
    Italic = "italic",
    Bold = "bold",
}

/**
 * Possible ways to output method parameters in the class diagram.
 */
export enum MethodParameterOutput {
    None = 0,
    OnlyNames = 1,
    OnlyTypes = 2,
    Complete = 3,
}

/**
 * Possible diagram legend types.
 */
export enum LegendType {
    None = 0,
    OnlyIncluded = 1,
    Full = 2,
}

/**
 * Possible ways to order class members in the class diagram.
 */
export enum MemberOrder {
    None = 0,
    Abc = 1,
    PublicToPrivate = 2,
    PrivateToPublic = 3,
}
