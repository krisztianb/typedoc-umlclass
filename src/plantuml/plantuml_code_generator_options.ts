import { ClassDiagramMemberVisibilityStyle, ClassDiagramType, FontStyle, MethodParameterOutput } from "../enumerations";

/**
 * Options for the PlantUmlGenerator.
 */
export interface PlantUmlCodeGeneratorOptions {
    classDiagramType: ClassDiagramType;
    classDiagramMethodParameterOutput: MethodParameterOutput;
    classDiagramHideEmptyMembers: boolean;
    classDiagramTopDownLayoutMaxSiblings: number;
    classDiagramMemberVisibilityStyle: ClassDiagramMemberVisibilityStyle;
    classDiagramHideCircledChar: boolean;
    classDiagramHideShadow: boolean;
    classDiagramBoxBackgroundColor: string;
    classDiagramBoxBorderColor: string;
    classDiagramBoxBorderRadius: number;
    classDiagramBoxBorderWidth: number;
    classDiagramArrowColor: string;
    classDiagramClassFontName: string;
    classDiagramClassFontSize: number;
    classDiagramClassFontStyle: FontStyle;
    classDiagramClassFontColor: string;
    classDiagramClassAttributeFontName: string;
    classDiagramClassAttributeFontSize: number;
    classDiagramClassAttributeFontStyle: FontStyle;
    classDiagramClassAttributeFontColor: string;
}
