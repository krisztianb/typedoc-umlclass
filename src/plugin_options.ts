import {
    Application,
    ParameterType,
    MapDeclarationOption,
    BooleanDeclarationOption,
    NumberDeclarationOption,
    StringDeclarationOption,
} from "typedoc";

/**
 * Supported image output formats.
 */
export enum ImageFormat {
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
 * Supported class diagram types when automatically generating class diagrams.
 */
export enum ClassDiagramType {
    None = 1,
    Simple = 2,
    Detailed = 3,
}

/**
 * Supported class diagram positions when automatically generating class diagrams.
 */
export enum ClassDiagramPosition {
    Above = 1,
    Below = 2,
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
export enum FontStyle {
    Undefined = "",
    Normal = "normal",
    Plain = "plain",
    Italic = "italic",
    Bold = "bold",
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** The image format used for generating UML diagrams. */
    private outputImageFormatOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramFormat",
        help: "png|svg",
        defaultValue: ImageFormat.PNG,
        map: new Map([
            ["png", ImageFormat.PNG],
            ["svg", ImageFormat.SVG],
        ]),
        value: ImageFormat.PNG,
    };

    /** The location where the generated UML diagrams should be stored. */
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

    /** Specifies whether UML class diagrams should be created automatically. */
    private autoClassDiagramTypeOption = {
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

    /** Specifies where on the page the automatically created class diagram should be put. */
    private autoClassDiagramPositionOption = {
        type: ParameterType.Map,
        name: "umlClassDiagramPosition",
        help: "above|below",
        defaultValue: ClassDiagramPosition.Below,
        map: new Map([
            ["above", ClassDiagramPosition.Above],
            ["below", ClassDiagramPosition.Below],
        ]),
        value: ClassDiagramPosition.Below,
    };

    /** Specifies whether to hide empty properties and methods in the automatically created class diagram. */
    private autoClassDiagramHideEmptyMembersOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideEmptyMembers",
        help: "true|false",
        defaultValue: true,
        value: true,
    };

    /** Specifies the boundary before swiching from top->down to left->right direction for class diagrams. */
    private autoClassDiagramTopDownLayoutMaxSiblingsOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramTopDownLayoutMaxSiblings",
        help: "An integer indicating the max number of siblings to be used with the default top down layout.",
        defaultValue: 6,
        minValue: 0,
        value: 6,
    };

    /** Specifies whether UML class diagrams should be created automatically. */
    private autoClassDiagramMemberVisibilityStyleOption = {
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
     * Specifies whether to hide the circled character in front of class names
     * in the automatically created class diagram.
     */
    private autoClassDiagramHideCircledCharOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideCircledChar",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies whether to hide the shadowing in the automatically created class diagrams */
    private autoClassDiagramHideShadowOption = {
        type: ParameterType.Boolean,
        name: "umlClassDiagramHideShadow",
        help: "true|false",
        defaultValue: false,
        value: false,
    };

    /** Specifies the background color used for boxes in automatically created class diagrams. */
    private autoClassDiagramBoxBackgroundColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBackgroundColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border color used for boxes in automatically created class diagrams. */
    private autoClassDiagramBoxBorderColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramBoxBorderColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the border radius used for boxes in automatically created class diagrams. */
    private autoClassDiagramBoxBorderRadiusOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderRadius",
        help: "The box border radius in pixel used when automatically creating class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the border width used for boxes in automatically created class diagrams. */
    private autoClassDiagramBoxBorderWidthOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramBoxBorderWidth",
        help: "The box border width in pixel used when automatically creating class diagrams.",
        defaultValue: -1, // because 0 can be used to hide borders
        minValue: 0,
        value: -1,
    };

    /** Specifies the color used for arrows in automatically created class diagrams. */
    private autoClassDiagramArrowColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramArrowColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class name in automatically created class diagrams. */
    private autoClassDiagramClassFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontName",
        help: "The name of the font used for the class name when automatically creating class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class name in automatically created class diagrams. */
    private autoClassDiagramClassFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassFontSize",
        help: "The font size in pixel used for the class name when automatically creating class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class name in automatically created class diagrams. */
    private autoClassDiagramClassFontStyleOption = {
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

    /** Specifies the font color for the class name in automatically created class diagrams. */
    private autoClassDiagramClassFontColorOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassFontColor",
        help: "transparent|#RGBHEX",
        defaultValue: "",
        value: "",
    };

    /** Specifies the name of the font used for the class attributes in automatically created class diagrams. */
    private autoClassDiagramClassAttributeFontNameOption = {
        type: ParameterType.String,
        name: "umlClassDiagramClassAttributeFontName",
        help: "The name of the font used for the class attributes when automatically creating class diagrams.",
        defaultValue: "",
        value: "",
    };

    /** Specifies the font size for the class attributes in automatically created class diagrams. */
    private autoClassDiagramClassAttributeFontSizeOption = {
        type: ParameterType.Number,
        name: "umlClassDiagramClassAttributeFontSize",
        help: "The font size in pixel used for the class attributes when automatically creating class diagrams.",
        defaultValue: 0,
        minValue: 0,
        value: 0,
    };

    /** Specifies the font style for the class attributes in automatically created class diagrams. */
    private autoClassDiagramClassAttributeFontStyleOption = {
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

    /** Specifies the font color for the class attributes in automatically created class diagrams. */
    private autoClassDiagramClassAttributeFontColorOption = {
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
        typedoc.options.addDeclaration(this.outputImageFormatOption as MapDeclarationOption<ImageFormat>);
        typedoc.options.addDeclaration(this.outputImageLocationOption as MapDeclarationOption<ImageLocation>);
        typedoc.options.addDeclaration(this.autoClassDiagramTypeOption as MapDeclarationOption<ClassDiagramType>);
        typedoc.options.addDeclaration(this.autoClassDiagramPositionOption as MapDeclarationOption<ClassDiagramPosition>);
        typedoc.options.addDeclaration(this.autoClassDiagramHideEmptyMembersOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramTopDownLayoutMaxSiblingsOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramMemberVisibilityStyleOption as MapDeclarationOption<ClassDiagramMemberVisibilityStyle>);
        typedoc.options.addDeclaration(this.autoClassDiagramHideCircledCharOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramHideShadowOption as BooleanDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBackgroundColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderRadiusOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderWidthOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramArrowColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontColorOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontNameOption as StringDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontSizeOption as NumberDeclarationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontStyleOption as MapDeclarationOption<FontStyle>);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontColorOption as StringDeclarationOption);
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param appOptions The TypeDoc application.
     */
    // prettier-ignore
    public readValuesFromApplication(typedoc: Application): void {
        this.outputImageFormatOption.value = typedoc.options.getValue(this.outputImageFormatOption.name) as ImageFormat;
        this.outputImageLocationOption.value = typedoc.options.getValue(this.outputImageLocationOption.name) as ImageLocation;
        this.autoClassDiagramTypeOption.value = typedoc.options.getValue(this.autoClassDiagramTypeOption.name) as ClassDiagramType;
        this.autoClassDiagramPositionOption.value = typedoc.options.getValue(this.autoClassDiagramPositionOption.name) as ClassDiagramPosition;
        this.autoClassDiagramHideEmptyMembersOption.value = typedoc.options.getValue(this.autoClassDiagramHideEmptyMembersOption.name) as boolean;
        this.autoClassDiagramTopDownLayoutMaxSiblingsOption.value = typedoc.options.getValue(this.autoClassDiagramTopDownLayoutMaxSiblingsOption.name) as number;
        this.autoClassDiagramMemberVisibilityStyleOption.value = typedoc.options.getValue(this.autoClassDiagramMemberVisibilityStyleOption.name) as ClassDiagramMemberVisibilityStyle;
        this.autoClassDiagramHideCircledCharOption.value = typedoc.options.getValue(this.autoClassDiagramHideCircledCharOption.name) as boolean;
        this.autoClassDiagramHideShadowOption.value = typedoc.options.getValue(this.autoClassDiagramHideShadowOption.name) as boolean;
        this.autoClassDiagramBoxBackgroundColorOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBackgroundColorOption.name) as string;
        this.autoClassDiagramBoxBorderColorOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderColorOption.name) as string;
        this.autoClassDiagramBoxBorderRadiusOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderRadiusOption.name) as number;
        this.autoClassDiagramBoxBorderWidthOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderWidthOption.name) as number;
        this.autoClassDiagramArrowColorOption.value = typedoc.options.getValue(this.autoClassDiagramArrowColorOption.name) as string;
        this.autoClassDiagramClassFontNameOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontNameOption.name) as string;
        this.autoClassDiagramClassFontSizeOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontSizeOption.name) as number;
        this.autoClassDiagramClassFontStyleOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontStyleOption.name) as FontStyle;
        this.autoClassDiagramClassFontColorOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontColorOption.name) as string;
        this.autoClassDiagramClassAttributeFontNameOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontNameOption.name) as string;
        this.autoClassDiagramClassAttributeFontSizeOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontSizeOption.name) as number;
        this.autoClassDiagramClassAttributeFontStyleOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontStyleOption.name) as FontStyle;
        this.autoClassDiagramClassAttributeFontColorOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontColorOption.name) as string;
    }

    /**
     * Returns the image format used for generating UML diagrams.
     * @returns The image format used for generating UML diagrams.
     */
    get outputImageFormat(): ImageFormat {
        return this.outputImageFormatOption.value;
    }

    /**
     * Returns the location where the generated UML diagrams should be stored.
     * @returns The location where the generated UML diagrams should be stored.
     */
    get outputImageLocation(): ImageLocation {
        return this.outputImageLocationOption.value;
    }

    /**
     * Returns whether UML class diagrams should be created automatically.
     * @returns Whether UML class diagrams should be created automatically.
     */
    get autoClassDiagramType(): ClassDiagramType {
        return this.autoClassDiagramTypeOption.value;
    }

    /**
     * Returns where on the page the automatically created class diagram should be put.
     * @returns Where on the page the automatically created class diagram should be put.
     */
    get autoClassDiagramPosition(): ClassDiagramPosition {
        return this.autoClassDiagramPositionOption.value;
    }

    /**
     * Returns whether to hide empty properties and methods in the automatically created class diagram.
     * @returns Whether to hide empty properties and methods in the automatically created class diagram.
     */
    get autoClassDiagramHideEmptyMembers(): boolean {
        return this.autoClassDiagramHideEmptyMembersOption.value;
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    get autoClassDiagramTopDownLayoutMaxSiblings(): number {
        return this.autoClassDiagramTopDownLayoutMaxSiblingsOption.value;
    }

    /**
     * Returns how the member visibility is rendered in the automatically created class diagram.
     * @returns How the member visibility is rendered in the automatically created class diagram.
     */
    get autoClassDiagramMemberVisibilityStyle(): ClassDiagramMemberVisibilityStyle {
        return this.autoClassDiagramMemberVisibilityStyleOption.value;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    get autoClassDiagramHideCircledChar(): boolean {
        return this.autoClassDiagramHideCircledCharOption.value;
    }

    /**
     * Returns whether to hide the shadows in the automatically created class diagram.
     * @returns Whether to hide the shadows in the automatically created class diagram.
     */
    get autoClassDiagramHideShadow(): boolean {
        return this.autoClassDiagramHideShadowOption.value;
    }

    /**
     * Returns the background color that should be used for boxes in automatically created class diagrams.
     * @returns The background color that should be used for boxes in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramBoxBackgroundColor(): string {
        return this.autoClassDiagramBoxBackgroundColorOption.value;
    }

    /**
     * Returns the border color that should be used for boxes in automatically created class diagrams.
     * @returns The border color that should be used for boxes in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramBoxBorderColor(): string {
        return this.autoClassDiagramBoxBorderColorOption.value;
    }

    /**
     * Returns the border radius that should be used for boxes in automatically created class diagrams.
     * @returns The border radius that should be used for boxes in automatically created class diagrams.
     */
    get autoClassDiagramBoxBorderRadius(): number {
        return this.autoClassDiagramBoxBorderRadiusOption.value;
    }

    /**
     * Returns the border width that should be used for boxes in automatically created class diagrams.
     * @returns The border width that should be used for boxes in automatically created class diagrams.
     *          The value -1 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramBoxBorderWidth(): number {
        return this.autoClassDiagramBoxBorderWidthOption.value;
    }

    /**
     * Returns the color that should be used for arrows in automatically created class diagrams.
     * @returns The color that should be used for arrows in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramArrowColor(): string {
        return this.autoClassDiagramArrowColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for the class name in automatically created class diagrams.
     * @returns The name of the font that should be used for the class name in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassFontName(): string {
        return this.autoClassDiagramClassFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class names in automatically created class diagrams.
     * @returns The font size that should be used for class names in automatically created class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassFontSize(): number {
        return this.autoClassDiagramClassFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class name in automatically created class diagrams.
     * @returns The font style that should be used for the class name in automatically created class diagrams.
     */
    get autoClassDiagramClassFontStyle(): FontStyle {
        return this.autoClassDiagramClassFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class name in automatically created class diagrams.
     * @returns The font color that should be used for the class name in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassFontColor(): string {
        return this.autoClassDiagramClassFontColorOption.value;
    }

    /**
     * Returns the name of the font that should be used for class attributes in automatically created class diagrams.
     * @returns The name of the font that should be used for class attributes in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassAttributeFontName(): string {
        return this.autoClassDiagramClassAttributeFontNameOption.value;
    }

    /**
     * Returns the font size that should be used for class attributes in automatically created class diagrams.
     * @returns The font size that should be used for class attributes in automatically created class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassAttributeFontSize(): number {
        return this.autoClassDiagramClassAttributeFontSizeOption.value;
    }

    /**
     * Returns the font style that should be used for the class attributes in automatically created class diagrams.
     * @returns The font style that should be used for the class attributes in automatically created class diagrams.
     */
    get autoClassDiagramClassAttributeFontStyle(): FontStyle {
        return this.autoClassDiagramClassAttributeFontStyleOption.value;
    }

    /**
     * Returns the font color that should be used for the class attributes in automatically created class diagrams.
     * @returns The font color that should be used for the class attributes in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramClassAttributeFontColor(): string {
        return this.autoClassDiagramClassAttributeFontColorOption.value;
    }
}
