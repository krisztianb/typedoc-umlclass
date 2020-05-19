import { ClassDiagramMemberVisibilityStyle, ClassDiagramType, FontStyle, MethodParameterOutput } from "../enumerations";

/**
 * Options for the PlantUmlGenerator.
 */
export interface PlantUmlGeneratorOptions {
    umlClassDiagramType: ClassDiagramType;
    umlClassDiagramMethodParameterOutput: MethodParameterOutput;
    umlClassDiagramHideEmptyMembers: boolean;
    umlClassDiagramTopDownLayoutMaxSiblings: number;
    umlClassDiagramMemberVisibilityStyle: ClassDiagramMemberVisibilityStyle;
    umlClassDiagramHideCircledChar: boolean;
    umlClassDiagramHideShadow: boolean;
    umlClassDiagramBoxBackgroundColor: string;
    umlClassDiagramBoxBorderColor: string;
    umlClassDiagramBoxBorderRadius: number;
    umlClassDiagramBoxBorderWidth: number;
    umlClassDiagramArrowColor: string;
    umlClassDiagramClassFontName: string;
    umlClassDiagramClassFontSize: number;
    umlClassDiagramClassFontStyle: FontStyle;
    umlClassDiagramClassFontColor: string;
    umlClassDiagramClassAttributeFontName: string;
    umlClassDiagramClassAttributeFontSize: number;
    umlClassDiagramClassAttributeFontStyle: FontStyle;
    umlClassDiagramClassAttributeFontColor: string;
}
