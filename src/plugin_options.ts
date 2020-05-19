import {
    Application,
    BooleanDeclarationOption,
    MapDeclarationOption,
    NumberDeclarationOption,
    ParameterType,
    StringDeclarationOption,
} from "typedoc";
import { ClassDiagramMemberVisibilityStyle, ClassDiagramType, FontStyle, MethodParameterOutput } from "./enumerations";

/**
 * Supported image output formats.
 */
export const enum ImageFormat {
    PNG = "png",
    SVG = "svg",
}

/**
 * Supported image output locations.
 */
export enum ImageLocation {
    Local = 1,
    Remote = 2,
}

/**
 * Supported class diagram positions.
 */
export enum ClassDiagramPosition {
    Above = 1,
    Below = 2,
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** Specifies how detailed the class diagrams should be. */
    private umlClassDiagramTypeOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramType",
        help: "none|simple|detailed",
        defaultValue: ClassDiagramType.Detailed,
        map: new Map([
            ["none", ClassDiagramType.None],
            ["simple", ClassDiagramType.Simple],
            ["detailed", ClassDiagramType.Detailed],
        ]),
        value: ClassDiagramType.Detailed,
    };

    /** The location where the class diagrams should be stored. */
    private outputImageLocationOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramLocation",
        help: "local|remote",
        defaultValue: ImageLocation.Local,
        map: new Map([
            ["local", ImageLocation.Local],
            ["remote", ImageLocation.Remote],
        ]),
        value: ImageLocation.Local,
    };

    /** The image format used for the class diagrams. */
    private outputImageFormatOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramFormat",
        help: "png|svg",
        defaultValue: ImageFormat.SVG,
        map: new Map([
            ["png", ImageFormat.PNG],
            ["svg", ImageFormat.SVG],
        ]),
        value: ImageFormat.SVG,
    };

    /** Specifies how method parameters should be output in the class diagrams. */
    private umlClassDiagramMethodParameterOutputOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramMethodParameterOutput",
        help: "none|only-names|only-types|complete",
        defaultValue: MethodParameterOutput.Complete,
        map: new Map([
            ["none", MethodParameterOutput.None],
            ["only-names", MethodParameterOutput.OnlyNames],
            ["only-types", MethodParameterOutput.OnlyTypes],
            ["complete", MethodParameterOutput.Complete],
        ]),
        value: MethodParameterOutput.Complete,
    };

    /** Specifies the background color used for boxes in the class diagrams. */
    private umlClassDiagramSectionTitleOption = {
        type: ParameterType.String,
        name: "umlClassDiagramSectionTitle",
        help: "The title of the section on the page which includes the class diagram.",
        defaultValue: "Hierarchy-Diagram",
        value: "Hierarchy-Diagram",
    };

    /** Specifies where on the page the class diagram should be put. */
    private umlClassDiagramPositionOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramPosition",
        help: "above|below",
        defaultValue: ClassDiagramPosition.Above,
        map: new Map([
            ["above", ClassDiagramPosition.Above],
            ["below", ClassDiagramPosition.Below],
        ]),
        value: ClassDiagramPosition.Above,
    };

    /** Specifies whether to hide empty properties and methods in the class diagrams. */
    private umlClassDiagramHideEmptyMembersOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideEmptyMembers",
        help: "true|false",
        defaultValue: true,
        value: true,
    };

    /** Specifies the boundary before swiching from top->down to left->right direction for class diagrams. */
    private umlClassDiagramTopDownLayoutMaxSiblingsOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramTopDownLayoutMaxSiblings",
        help: "An integer indicating the max number of siblings to be used with the default top down layout.",
        defaultValue: 6,
        minValue: 0,
        value: 6,
    };

    /** Specifies how the visibility of members should be displayed in the class diagrams. */
    private umlClassDiagramMemberVisibilityStyleOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramMemberVisibilityStyle",
        help: "text|icon",
        defaultValue: ClassDiagramMemberVisibilityStyle.Icon,
        map: new Map([
            ["text", ClassDiagramMemberVisibilityStyle.Text],
            ["icon", ClassDiagramMemberVisibilityStyle.Icon],
        ]),
        value: ClassDiagramMemberVisibilityStyle.Icon,
    };

    /**
     * Specifies whether to hide the circled character in front of class names in the class diagrams.
     */
    private umlClassDiagramHideCircledCharOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideCircledChar",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies whether to hide the shadowing in the class diagrams. */
    private umlClassDiagramHideShadowOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideShadow",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies the background color used for boxes in the class diagrams. */
    private umlClassDiagramBoxBackgroundColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBackgroundColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border color used for boxes in the class diagrams. */
    private umlClassDiagramBoxBorderColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBorderColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border radius used for boxes in the class diagrams. */
    private umlClassDiagramBoxBorderRadiusOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderRadius",
        help: "The box border radius in pixel used for the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the border width used for boxes in the class diagrams. */
    private umlClassDiagramBoxBorderWidthOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderWidth",
        help: "The box border width in pixel used for the class diagrams.",
        defaultValue: -1, // because 0 can be used to hide borders
        minValue: 0,
        value: -1,
    };

    /** Specifies the color used for arrows in the class diagrams. */
    private umlClassDiagramArrowColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramArrowColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class name in the class diagrams. */
    private umlClassDiagramClassFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontName",
        help: "The name of the font used for the class name in the class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class name in the class diagrams. */
    private umlClassDiagramClassFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassFontSize",
        help: "The font size in pixel used for the class name in the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class name in the class diagrams. */
    private umlClassDiagramClassFontStyleOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramClassFontStyle",
        help: "normal|plain|italic|bold",
        defaultValue: FontStyle.Undefined,
        map: new Map([
            ["normal", FontStyle.Normal],
            ["plain", FontStyle.Plain],
            ["italic", FontStyle.Italic],
            ["bold", FontStyle.Bold],
        ]),
        value: FontStyle.Undefined,
    };

    /** Specifies the font color for the class name in the class diagrams. */
    private umlClassDiagramClassFontColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class attributes in the class diagrams. */
    private umlClassDiagramClassAttributeFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassAttributeFontName",
        help: "The name of the font used for the class attributes in the class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class attributes in the class diagrams. */
    private umlClassDiagramClassAttributeFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassAttributeFontSize",
        help: "The font size in pixel used for the class attributes in the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class attributes in the class diagrams. */
    private umlClassDiagramClassAttributeFontStyleOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramClassAttributeFontStyle",
        help: "normal|plain|italic|bold",
        defaultValue: FontStyle.Undefined,
        map: new Map([
            ["normal", FontStyle.Normal],
            ["plain", FontStyle.Plain],
            ["italic", FontStyle.Italic],
            ["bold", FontStyle.Bold],
        ]),
        value: FontStyle.Undefined,
    };

    /** Specifies the font color for the class attributes in the class diagrams. */
    private umlClassDiagramClassAttributeFontColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassAttributeFontColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // prettier-ignore
    public addToApplication(typedoc: Application): void {
        typedoc.options.addDeclaration(this.umlClassDiagramTypeOption as MapDeclarationOption<ClassDiagramType>);
        typedoc.options.addDeclaration(this.outputImageLocationOption as MapDeclarationOption<ImageLocation>);
        typedoc.options.addDeclaration(this.outputImageFormatOption as MapDeclarationOption<ImageFormat>);
        typedoc.options.addDeclaration(this.umlClassDiagramMethodParameterOutputOption as MapDeclarationOption<MethodParameterOutput>);
        typedoc.options.addDeclaration(this.umlClassDiagramSectionTitleOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramPositionOption as MapDeclarationOption<ClassDiagramPosition>);
        typedoc.options.addDeclaration(this.umlClassDiagramHideEmptyMembersOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramTopDownLayoutMaxSiblingsOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramMemberVisibilityStyleOption as MapDeclarationOption<ClassDiagramMemberVisibilityStyle>);
        typedoc.options.addDeclaration(this.umlClassDiagramHideCircledCharOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramHideShadowOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramBoxBackgroundColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramBoxBorderColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramBoxBorderRadiusOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramBoxBorderWidthOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramArrowColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.umlClassDiagramClassFontColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassAttributeFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassAttributeFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.umlClassDiagramClassAttributeFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.umlClassDiagramClassAttributeFontColorOption as StringDeclarationOption);
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param appOptions The TypeDoc application.
     */
    // prettier-ignore
    public readValuesFromApplication(typedoc: Application): void {
        this.umlClassDiagramTypeOption.value = typedoc.options.getValue(this.umlClassDiagramTypeOption.name) as ClassDiagramType;
        this.outputImageLocationOption.value = typedoc.options.getValue(this.outputImageLocationOption.name) as ImageLocation;
        this.outputImageFormatOption.value = typedoc.options.getValue(this.outputImageFormatOption.name) as ImageFormat;
        this.umlClassDiagramMethodParameterOutputOption.value = typedoc.options.getValue(this.umlClassDiagramMethodParameterOutputOption.name) as MethodParameterOutput;
        this.umlClassDiagramSectionTitleOption.value = typedoc.options.getValue(this.umlClassDiagramSectionTitleOption.name) as string;
        this.umlClassDiagramPositionOption.value = typedoc.options.getValue(this.umlClassDiagramPositionOption.name) as ClassDiagramPosition;
        this.umlClassDiagramHideEmptyMembersOption.value = typedoc.options.getValue(this.umlClassDiagramHideEmptyMembersOption.name) as boolean;
        this.umlClassDiagramTopDownLayoutMaxSiblingsOption.value = typedoc.options.getValue(this.umlClassDiagramTopDownLayoutMaxSiblingsOption.name) as number;
        this.umlClassDiagramMemberVisibilityStyleOption.value = typedoc.options.getValue(this.umlClassDiagramMemberVisibilityStyleOption.name) as ClassDiagramMemberVisibilityStyle;
        this.umlClassDiagramHideCircledCharOption.value = typedoc.options.getValue(this.umlClassDiagramHideCircledCharOption.name) as boolean;
        this.umlClassDiagramHideShadowOption.value = typedoc.options.getValue(this.umlClassDiagramHideShadowOption.name) as boolean;
        this.umlClassDiagramBoxBackgroundColorOption.value = typedoc.options.getValue(this.umlClassDiagramBoxBackgroundColorOption.name) as string;
        this.umlClassDiagramBoxBorderColorOption.value = typedoc.options.getValue(this.umlClassDiagramBoxBorderColorOption.name) as string;
        this.umlClassDiagramBoxBorderRadiusOption.value = typedoc.options.getValue(this.umlClassDiagramBoxBorderRadiusOption.name) as number;
        this.umlClassDiagramBoxBorderWidthOption.value = typedoc.options.getValue(this.umlClassDiagramBoxBorderWidthOption.name) as number;
        this.umlClassDiagramArrowColorOption.value = typedoc.options.getValue(this.umlClassDiagramArrowColorOption.name) as string;
        this.umlClassDiagramClassFontNameOption.value = typedoc.options.getValue(this.umlClassDiagramClassFontNameOption.name) as string;
        this.umlClassDiagramClassFontSizeOption.value = typedoc.options.getValue(this.umlClassDiagramClassFontSizeOption.name) as number;
        this.umlClassDiagramClassFontStyleOption.value = typedoc.options.getValue(this.umlClassDiagramClassFontStyleOption.name) as FontStyle;
        this.umlClassDiagramClassFontColorOption.value = typedoc.options.getValue(this.umlClassDiagramClassFontColorOption.name) as string;
        this.umlClassDiagramClassAttributeFontNameOption.value = typedoc.options.getValue(this.umlClassDiagramClassAttributeFontNameOption.name) as string;
        this.umlClassDiagramClassAttributeFontSizeOption.value = typedoc.options.getValue(this.umlClassDiagramClassAttributeFontSizeOption.name) as number;
        this.umlClassDiagramClassAttributeFontStyleOption.value = typedoc.options.getValue(this.umlClassDiagramClassAttributeFontStyleOption.name) as FontStyle;
        this.umlClassDiagramClassAttributeFontColorOption.value = typedoc.options.getValue(this.umlClassDiagramClassAttributeFontColorOption.name) as string;
    }

    /**
     * Returns how detailed the generated class diagrams should be.
     * @returns How detailed the generated class diagrams should be.
     */
    get umlClassDiagramType(): ClassDiagramType {
        return this.umlClassDiagramTypeOption.value;
    }

    /**
     * Returns the location where the class diagrams should be stored.
     * @returns The location where the class diagrams should be stored.
     */
    get outputImageLocation(): ImageLocation {
        return this.outputImageLocationOption.value;
    }

    /**
     * Returns the image format used for the class diagrams.
     * @returns The image format used for the class diagrams.
     */
    get outputImageFormat(): ImageFormat {
        return this.outputImageFormatOption.value;
    }

    /**
     * Returns how method parameters should be output in the class diagrams.
     * @returns How method parameters should be output in the class diagrams.
     */
    get umlClassDiagramMethodParameterOutput(): MethodParameterOutput {
        return this.umlClassDiagramMethodParameterOutputOption.value;
    }

    /**
     * Returns the title that should be used for the section that contains the class diagrams.
     * @returns The title that should be used for the section that contains the class diagrams.
     */
    get umlClassDiagramSectionTitle(): string {
        return this.umlClassDiagramSectionTitleOption.value;
    }

    /**
     * Returns where on the page the class diagrams should be put.
     * @returns Where on the page the class diagrams should be put.
     */
    get umlClassDiagramPosition(): ClassDiagramPosition {
        return this.umlClassDiagramPositionOption.value;
    }

    /**
     * Returns whether to hide empty properties and methods in the class diagrams.
     * @returns Whether to hide empty properties and methods in the class diagrams.
     */
    get umlClassDiagramHideEmptyMembers(): boolean {
        return this.umlClassDiagramHideEmptyMembersOption.value;
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    get umlClassDiagramTopDownLayoutMaxSiblings(): number {
        return this.umlClassDiagramTopDownLayoutMaxSiblingsOption.value;
    }

    /**
     * Returns how the member visibility is rendered in the class diagrams.
     * @returns How the member visibility is rendered in the class diagrams.
     */
    get umlClassDiagramMemberVisibilityStyle(): ClassDiagramMemberVisibilityStyle {
        return this.umlClassDiagramMemberVisibilityStyleOption.value;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    get umlClassDiagramHideCircledChar(): boolean {
        return this.umlClassDiagramHideCircledCharOption.value;
    }

    /**
     * Returns whether to hide the shadows in the class diagrams.
     * @returns Whether to hide the shadows in the class diagrams.
     */
    get umlClassDiagramHideShadow(): boolean {
        return this.umlClassDiagramHideShadowOption.value;
    }

    /**
     * Returns the background color that should be used for boxes in the class diagrams.
     * @returns The background color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramBoxBackgroundColor(): string {
        return this.umlClassDiagramBoxBackgroundColorOption.value;
    }

    /**
     * Returns the border color that should be used for boxes in the class diagrams.
     * @returns The border color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramBoxBorderColor(): string {
        return this.umlClassDiagramBoxBorderColorOption.value;
    }

    /**
     * Returns the border radius that should be used for boxes in the class diagrams.
     * @returns The border radius that should be used for boxes in the class diagrams.
     */
    get umlClassDiagramBoxBorderRadius(): number {
        return this.umlClassDiagramBoxBorderRadiusOption.value;
    }

    /**
     * Returns the border width that should be used for boxes in the class diagrams.
     * @returns The border width that should be used for boxes in the class diagrams.
     *          The value -1 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramBoxBorderWidth(): number {
        return this.umlClassDiagramBoxBorderWidthOption.value;
    }

    /**
     * Returns the color that should be used for arrows in the class diagrams.
     * @returns The color that should be used for arrows in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramArrowColor(): string {
        return this.umlClassDiagramArrowColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for the class name in the class diagrams.
     * @returns The name of the font that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassFontName(): string {
        return this.umlClassDiagramClassFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class names in the class diagrams.
     * @returns The font size that should be used for class names in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassFontSize(): number {
        return this.umlClassDiagramClassFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class name in the class diagrams.
     * @returns The font style that should be used for the class name in the class diagrams.
     */
    get umlClassDiagramClassFontStyle(): FontStyle {
        return this.umlClassDiagramClassFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class name in the class diagrams.
     * @returns The font color that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassFontColor(): string {
        return this.umlClassDiagramClassFontColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for class attributes in the class diagrams.
     * @returns The name of the font that should be used for class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassAttributeFontName(): string {
        return this.umlClassDiagramClassAttributeFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class attributes in the class diagrams.
     * @returns The font size that should be used for class attributes in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassAttributeFontSize(): number {
        return this.umlClassDiagramClassAttributeFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class attributes in the class diagrams.
     * @returns The font style that should be used for the class attributes in the class diagrams.
     */
    get umlClassDiagramClassAttributeFontStyle(): FontStyle {
        return this.umlClassDiagramClassAttributeFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class attributes in the class diagrams.
     * @returns The font color that should be used for the class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get umlClassDiagramClassAttributeFontColor(): string {
        return this.umlClassDiagramClassAttributeFontColorOption.value;
    }
}
