import {
    ClassDiagramMemberVisibilityStyle,
    ClassDiagramType,
    FontStyle,
    MemberOrder,
    MethodParameterOutput,
} from "../enumerations";

/**
 * Options for the PlantUmlGenerator.
 */
export type PlantUmlCodeGeneratorOptions = {
    classDiagramType: ClassDiagramType;
    classDiagramMethodParameterOutput: MethodParameterOutput;
    classDiagramMemberOrder: MemberOrder;
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
};
