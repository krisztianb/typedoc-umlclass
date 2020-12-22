import {
    Application,
    BooleanDeclarationOption,
    MapDeclarationOption,
    NumberDeclarationOption,
    ParameterType,
    StringDeclarationOption,
} from "typedoc";
import {
    ClassDiagramMemberVisibilityStyle,
    ClassDiagramType,
    FontStyle,
    LegendType,
    MemberOrder,
    MethodParameterOutput,
} from "./enumerations";

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
    Embed = 3,
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
    private classDiagramTypeOption = {
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
        help: "local|remote|embed",
        defaultValue: ImageLocation.Local,
        map: new Map([
            ["local", ImageLocation.Local],
            ["remote", ImageLocation.Remote],
            ["embed", ImageLocation.Embed],
        ]),
        value: ImageLocation.Local,
    };

    /** The base URL when generating remote images. */
    private outputRemoteBaseUrlOption = {
        type: ParameterType.String,
        name: "umlClassDiagramRemoteBaseUrl",
        help: "The base URL when generating remote images.",
        defaultValue: "http://www.plantuml.com",
        value: "http://www.plantuml.com",
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

    /** Specifies the background color used for boxes in the class diagrams. */
    private sectionTitleOption = {
        type: ParameterType.String,
        name: "umlClassDiagramSectionTitle",
        help: "The title of the section on the page which includes the class diagram.",
        defaultValue: "Hierarchy-Diagram",
        value: "Hierarchy-Diagram",
    };

    /** Specifies where on the page the class diagram should be put. */
    private classDiagramPositionOption = {
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

    /** Specifies what kind of legend should be added below the class diagrams. */
    private legendTypeOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramLegendType",
        help: "none|only-included|full",
        defaultValue: LegendType.OnlyIncluded,
        map: new Map([
            ["none", LegendType.None],
            ["only-included", LegendType.OnlyIncluded],
            ["full", LegendType.Full],
        ]),
        value: LegendType.OnlyIncluded,
    };

    /** Specifies how method parameters should be output in the class diagrams. */
    private classDiagramMethodParameterOutputOption = {
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

    /** Specifies how class members should be ordered in the class diagrams. */
    private classDiagramMemberOrderOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramMemberOrder",
        help: "abc|public-to-private|private-to-public",
        defaultValue: MemberOrder.PublicToPrivate,
        map: new Map([
            ["abc", MemberOrder.Abc],
            ["public-to-private", MemberOrder.PublicToPrivate],
            ["private-to-public", MemberOrder.PrivateToPublic],
        ]),
        value: MemberOrder.PublicToPrivate,
    };

    /** Specifies whether to hide empty properties and methods in the class diagrams. */
    private classDiagramHideEmptyMembersOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideEmptyMembers",
        help: "true|false",
        defaultValue: true,
        value: true,
    };

    /** Specifies the boundary before swiching from top->down to left->right direction for class diagrams. */
    private classDiagramTopDownLayoutMaxSiblingsOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramTopDownLayoutMaxSiblings",
        help: "An integer indicating the max number of siblings to be used with the default top down layout.",
        defaultValue: 6,
        minValue: 0,
        value: 6,
    };

    /** Specifies how the visibility of members should be displayed in the class diagrams. */
    private classDiagramMemberVisibilityStyleOption = {
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
    private classDiagramHideCircledCharOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideCircledChar",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies whether to hide the shadowing in the class diagrams. */
    private classDiagramHideShadowOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideShadow",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies the background color used for boxes in the class diagrams. */
    private classDiagramBoxBackgroundColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBackgroundColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border color used for boxes in the class diagrams. */
    private classDiagramBoxBorderColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBorderColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border radius used for boxes in the class diagrams. */
    private classDiagramBoxBorderRadiusOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderRadius",
        help: "The box border radius in pixel used for the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the border width used for boxes in the class diagrams. */
    private classDiagramBoxBorderWidthOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderWidth",
        help: "The box border width in pixel used for the class diagrams.",
        defaultValue: -1, // because 0 can be used to hide borders
        minValue: 0,
        value: -1,
    };

    /** Specifies the color used for arrows in the class diagrams. */
    private classDiagramArrowColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramArrowColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class name in the class diagrams. */
    private classDiagramClassFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontName",
        help: "The name of the font used for the class name in the class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class name in the class diagrams. */
    private classDiagramClassFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassFontSize",
        help: "The font size in pixel used for the class name in the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class name in the class diagrams. */
    private classDiagramClassFontStyleOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramClassFontStyle",
        help: "normal|plain|italic|bold",
        defaultValue: FontStyle.Default,
        map: new Map([
            ["normal", FontStyle.Normal],
            ["plain", FontStyle.Plain],
            ["italic", FontStyle.Italic],
            ["bold", FontStyle.Bold],
        ]),
        value: FontStyle.Default,
    };

    /** Specifies the font color for the class name in the class diagrams. */
    private classDiagramClassFontColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class attributes in the class diagrams. */
    private classDiagramClassAttributeFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassAttributeFontName",
        help: "The name of the font used for the class attributes in the class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class attributes in the class diagrams. */
    private classDiagramClassAttributeFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassAttributeFontSize",
        help: "The font size in pixel used for the class attributes in the class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class attributes in the class diagrams. */
    private classDiagramClassAttributeFontStyleOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramClassAttributeFontStyle",
        help: "normal|plain|italic|bold",
        defaultValue: FontStyle.Default,
        map: new Map([
            ["normal", FontStyle.Normal],
            ["plain", FontStyle.Plain],
            ["italic", FontStyle.Italic],
            ["bold", FontStyle.Bold],
        ]),
        value: FontStyle.Default,
    };

    /** Specifies the font color for the class attributes in the class diagrams. */
    private classDiagramClassAttributeFontColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassAttributeFontColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies how many PlantUML processes should be used for generating the class diagrams. */
    private generatorProcessCountOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramGeneratorProcessCount",
        help: "The number of PlantUML processes used for generating the class diagrams.",
        defaultValue: 1,
        minValue: 1,
        value: 1,
    };

    /** Specifies whether to hide the progress bar while generating diagrams. */
    private hideProgressBarOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideProgressBar",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies whether to create files containing the PlantUML code of the class diagrams. */
    private createPlantUmlFilesOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramCreatePlantUmlFiles",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies whether the plugin should output verbose info during its work. */
    private createVerboseOutputOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramVerboseOutput",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // prettier-ignore
    /* eslint-disable max-len */
    public addToApplication(typedoc: Application): void {
        typedoc.options.addDeclaration(this.classDiagramTypeOption as MapDeclarationOption<ClassDiagramType>);
        typedoc.options.addDeclaration(this.outputImageLocationOption as MapDeclarationOption<ImageLocation>);
        typedoc.options.addDeclaration(this.outputRemoteBaseUrlOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.outputImageFormatOption as MapDeclarationOption<ImageFormat>);
        typedoc.options.addDeclaration(this.sectionTitleOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramPositionOption as MapDeclarationOption<ClassDiagramPosition>);
        typedoc.options.addDeclaration(this.legendTypeOption as MapDeclarationOption<LegendType>);
        typedoc.options.addDeclaration(this.classDiagramMethodParameterOutputOption as MapDeclarationOption<MethodParameterOutput>);
        typedoc.options.addDeclaration(this.classDiagramMemberOrderOption as MapDeclarationOption<MemberOrder>);
        typedoc.options.addDeclaration(this.classDiagramHideEmptyMembersOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramTopDownLayoutMaxSiblingsOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramMemberVisibilityStyleOption as MapDeclarationOption<ClassDiagramMemberVisibilityStyle>);
        typedoc.options.addDeclaration(this.classDiagramHideCircledCharOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramHideShadowOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramBoxBackgroundColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramBoxBorderColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramBoxBorderRadiusOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramBoxBorderWidthOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramArrowColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.classDiagramClassFontColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassAttributeFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassAttributeFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.classDiagramClassAttributeFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.classDiagramClassAttributeFontColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.generatorProcessCountOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.hideProgressBarOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.createPlantUmlFilesOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.createVerboseOutputOption as BooleanDeclarationOption);
    }
    /* eslint-enable max-len */

    /**
     * Reads the values of the plugin options from the application options.
     * @param appOptions The TypeDoc application.
     */
    // prettier-ignore
    /* eslint-disable max-len */
    public readValuesFromApplication(typedoc: Application): void {
        this.classDiagramTypeOption.value = typedoc.options.getValue(this.classDiagramTypeOption.name) as ClassDiagramType;
        this.outputImageLocationOption.value = typedoc.options.getValue(this.outputImageLocationOption.name) as ImageLocation;
        this.outputRemoteBaseUrlOption.value = typedoc.options.getValue(this.outputRemoteBaseUrlOption.name) as string;
        this.outputImageFormatOption.value = typedoc.options.getValue(this.outputImageFormatOption.name) as ImageFormat;
        this.sectionTitleOption.value = typedoc.options.getValue(this.sectionTitleOption.name) as string;
        this.classDiagramPositionOption.value = typedoc.options.getValue(this.classDiagramPositionOption.name) as ClassDiagramPosition;
        this.legendTypeOption.value = typedoc.options.getValue(this.legendTypeOption.name) as LegendType;
        this.classDiagramMethodParameterOutputOption.value = typedoc.options.getValue(this.classDiagramMethodParameterOutputOption.name) as MethodParameterOutput;
        this.classDiagramMemberOrderOption.value = typedoc.options.getValue(this.classDiagramMemberOrderOption.name) as MemberOrder;
        this.classDiagramHideEmptyMembersOption.value = typedoc.options.getValue(this.classDiagramHideEmptyMembersOption.name) as boolean;
        this.classDiagramTopDownLayoutMaxSiblingsOption.value = typedoc.options.getValue(this.classDiagramTopDownLayoutMaxSiblingsOption.name) as number;
        this.classDiagramMemberVisibilityStyleOption.value = typedoc.options.getValue(this.classDiagramMemberVisibilityStyleOption.name) as ClassDiagramMemberVisibilityStyle;
        this.classDiagramHideCircledCharOption.value = typedoc.options.getValue(this.classDiagramHideCircledCharOption.name) as boolean;
        this.classDiagramHideShadowOption.value = typedoc.options.getValue(this.classDiagramHideShadowOption.name) as boolean;
        this.classDiagramBoxBackgroundColorOption.value = typedoc.options.getValue(this.classDiagramBoxBackgroundColorOption.name) as string;
        this.classDiagramBoxBorderColorOption.value = typedoc.options.getValue(this.classDiagramBoxBorderColorOption.name) as string;
        this.classDiagramBoxBorderRadiusOption.value = typedoc.options.getValue(this.classDiagramBoxBorderRadiusOption.name) as number;
        this.classDiagramBoxBorderWidthOption.value = typedoc.options.getValue(this.classDiagramBoxBorderWidthOption.name) as number;
        this.classDiagramArrowColorOption.value = typedoc.options.getValue(this.classDiagramArrowColorOption.name) as string;
        this.classDiagramClassFontNameOption.value = typedoc.options.getValue(this.classDiagramClassFontNameOption.name) as string;
        this.classDiagramClassFontSizeOption.value = typedoc.options.getValue(this.classDiagramClassFontSizeOption.name) as number;
        this.classDiagramClassFontStyleOption.value = typedoc.options.getValue(this.classDiagramClassFontStyleOption.name) as FontStyle;
        this.classDiagramClassFontColorOption.value = typedoc.options.getValue(this.classDiagramClassFontColorOption.name) as string;
        this.classDiagramClassAttributeFontNameOption.value = typedoc.options.getValue(this.classDiagramClassAttributeFontNameOption.name) as string;
        this.classDiagramClassAttributeFontSizeOption.value = typedoc.options.getValue(this.classDiagramClassAttributeFontSizeOption.name) as number;
        this.classDiagramClassAttributeFontStyleOption.value = typedoc.options.getValue(this.classDiagramClassAttributeFontStyleOption.name) as FontStyle;
        this.classDiagramClassAttributeFontColorOption.value = typedoc.options.getValue(this.classDiagramClassAttributeFontColorOption.name) as string;
        this.generatorProcessCountOption.value = typedoc.options.getValue(this.generatorProcessCountOption.name) as number;
        this.hideProgressBarOption.value = typedoc.options.getValue(this.hideProgressBarOption.name) as boolean;
        this.createPlantUmlFilesOption.value = typedoc.options.getValue(this.createPlantUmlFilesOption.name) as boolean;
        this.createVerboseOutputOption.value = typedoc.options.getValue(this.createVerboseOutputOption.name) as boolean;
    }
    /* eslint-enable max-len */

    /**
     * Returns how detailed the generated class diagrams should be.
     * @returns How detailed the generated class diagrams should be.
     */
    public get classDiagramType(): ClassDiagramType {
        return this.classDiagramTypeOption.value;
    }

    /**
     * Returns the location where the class diagrams should be stored.
     * @returns The location where the class diagrams should be stored.
     */
    public get outputImageLocation(): ImageLocation {
        return this.outputImageLocationOption.value;
    }

    /**
     * Returns the base URL used when generating remote images.
     * @returns The base URL used when generating remote images.
     */
    public get outputRemoteBaseUrl(): string {
        return this.outputRemoteBaseUrlOption.value;
    }

    /**
     * Returns the image format used for the class diagrams.
     * @returns The image format used for the class diagrams.
     */
    public get outputImageFormat(): ImageFormat {
        return this.outputImageFormatOption.value;
    }

    /**
     * Returns the title that should be used for the section that contains the class diagrams.
     * @returns The title that should be used for the section that contains the class diagrams.
     */
    public get sectionTitle(): string {
        return this.sectionTitleOption.value;
    }

    /**
     * Returns where on the page the class diagrams should be put.
     * @returns Where on the page the class diagrams should be put.
     */
    public get classDiagramPosition(): ClassDiagramPosition {
        return this.classDiagramPositionOption.value;
    }

    /**
     * Returns the type of legend that should be generated for the class diagrams.
     * @returns The type of legend that should be generated for the class diagrams.
     */
    public get legendType(): LegendType {
        return this.legendTypeOption.value;
    }

    /**
     * Returns how method parameters should be output in the class diagrams.
     * @returns How method parameters should be output in the class diagrams.
     */
    public get classDiagramMethodParameterOutput(): MethodParameterOutput {
        return this.classDiagramMethodParameterOutputOption.value;
    }

    /**
     * Returns how class members should be ordered in the class diagrams.
     * @returns How class members should be ordered the class diagrams.
     */
    public get classDiagramMemberOrder(): MemberOrder {
        return this.classDiagramMemberOrderOption.value;
    }

    /**
     * Returns whether to hide empty properties and methods in the class diagrams.
     * @returns Whether to hide empty properties and methods in the class diagrams.
     */
    public get classDiagramHideEmptyMembers(): boolean {
        return this.classDiagramHideEmptyMembersOption.value;
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    public get classDiagramTopDownLayoutMaxSiblings(): number {
        return this.classDiagramTopDownLayoutMaxSiblingsOption.value;
    }

    /**
     * Returns how the member visibility is rendered in the class diagrams.
     * @returns How the member visibility is rendered in the class diagrams.
     */
    public get classDiagramMemberVisibilityStyle(): ClassDiagramMemberVisibilityStyle {
        return this.classDiagramMemberVisibilityStyleOption.value;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    public get classDiagramHideCircledChar(): boolean {
        return this.classDiagramHideCircledCharOption.value;
    }

    /**
     * Returns whether to hide the shadows in the class diagrams.
     * @returns Whether to hide the shadows in the class diagrams.
     */
    public get classDiagramHideShadow(): boolean {
        return this.classDiagramHideShadowOption.value;
    }

    /**
     * Returns the background color that should be used for boxes in the class diagrams.
     * @returns The background color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramBoxBackgroundColor(): string {
        return this.classDiagramBoxBackgroundColorOption.value;
    }

    /**
     * Returns the border color that should be used for boxes in the class diagrams.
     * @returns The border color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramBoxBorderColor(): string {
        return this.classDiagramBoxBorderColorOption.value;
    }

    /**
     * Returns the border radius that should be used for boxes in the class diagrams.
     * @returns The border radius that should be used for boxes in the class diagrams.
     */
    public get classDiagramBoxBorderRadius(): number {
        return this.classDiagramBoxBorderRadiusOption.value;
    }

    /**
     * Returns the border width that should be used for boxes in the class diagrams.
     * @returns The border width that should be used for boxes in the class diagrams.
     *          The value -1 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramBoxBorderWidth(): number {
        return this.classDiagramBoxBorderWidthOption.value;
    }

    /**
     * Returns the color that should be used for arrows in the class diagrams.
     * @returns The color that should be used for arrows in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramArrowColor(): string {
        return this.classDiagramArrowColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for the class name in the class diagrams.
     * @returns The name of the font that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassFontName(): string {
        return this.classDiagramClassFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class names in the class diagrams.
     * @returns The font size that should be used for class names in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassFontSize(): number {
        return this.classDiagramClassFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class name in the class diagrams.
     * @returns The font style that should be used for the class name in the class diagrams.
     */
    public get classDiagramClassFontStyle(): FontStyle {
        return this.classDiagramClassFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class name in the class diagrams.
     * @returns The font color that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassFontColor(): string {
        return this.classDiagramClassFontColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for class attributes in the class diagrams.
     * @returns The name of the font that should be used for class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassAttributeFontName(): string {
        return this.classDiagramClassAttributeFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class attributes in the class diagrams.
     * @returns The font size that should be used for class attributes in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassAttributeFontSize(): number {
        return this.classDiagramClassAttributeFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class attributes in the class diagrams.
     * @returns The font style that should be used for the class attributes in the class diagrams.
     */
    public get classDiagramClassAttributeFontStyle(): FontStyle {
        return this.classDiagramClassAttributeFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class attributes in the class diagrams.
     * @returns The font color that should be used for the class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classDiagramClassAttributeFontColor(): string {
        return this.classDiagramClassAttributeFontColorOption.value;
    }

    /**
     * Returns the number of PlantUML processes that should be used for generating the class diagrams.
     * @returns The number of PlantUML processes that should be used for generating the class diagrams.
     */
    public get generatorProcessCount(): number {
        return this.generatorProcessCountOption.value;
    }

    /**
     * Returns whether to hide the progress bar while generating the class diagrams.
     * @returns True, if the progress bar should not be displayed while generating the class diagrams, otherwise false.
     */
    public get hideProgressBar(): boolean {
        return this.hideProgressBarOption.value;
    }

    /**
     * Returns whether to create files containing the PlantUML code for the class diagrams.
     * @returns True, if files with the PlantUML code should be created, otherwise false.
     */
    public get createPlantUmlFiles(): boolean {
        return this.createPlantUmlFilesOption.value;
    }

    /**
     * Returns whether the plugin should output verbose info during its work.
     * @returns True, if plugin should create verbose output, otherwise false.
     */
    public get createVerboseOutput(): boolean {
        return this.createVerboseOutputOption.value;
    }
}
