import * as os from "os";
import { Application, ParameterType } from "typedoc";

/**
 * Type defining all options and their possible values of the plugin.
 */
type PluginOptionsType = {
    type?: "none" | "simple" | "detailed";
    location?: "local" | "remote" | "embed";
    remoteBaseUrl?: string;
    format?: "png" | "svg";
    sectionTitle?: string;
    position?: "above" | "below";
    legendType?: "none" | "only-included" | "full";
    methodParameterOutput?: "none" | "only-names" | "only-types" | "complete";
    memberOrder?: "abc" | "public-to-private" | "private-to-public";
    hideEmptyMembers?: boolean;
    topDownLayoutMaxSiblings?: number;
    visibilityStyle?: "text" | "icon";
    hideCircledChar?: boolean;
    hideShadow?: boolean;
    boxBackgroundColor?: string;
    boxBorderColor?: string;
    boxBorderRadius?: number;
    boxBorderWidth?: number;
    arrowColor?: string;
    classFontName?: string;
    classFontSize?: number;
    classFontStyle?: "normal" | "plain" | "italic" | "bold";
    classFontColor?: string;
    attributeFontName?: string;
    attributeFontSize?: number;
    attributeFontStyle?: "normal" | "plain" | "italic" | "bold";
    attributeFontColor?: string;
    generatorProcessCount?: number;
    hideProgressBar?: boolean;
    createPlantUmlFiles?: boolean;
    verboseOutput?: boolean;
};

/** Plugin options type without nullables. */
type RequiredPluginOptionsType = Required<PluginOptionsType>;

/**
 * Extend typedoc's options with the plugin's option using declaration merging.
 */
declare module "typedoc" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- This is not a separate type.
    export interface TypeDocOptionMap {
        umlClassDiagram?: PluginOptionsType;
    }
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** Plugin option values as provided by the user. */
    private userValues: PluginOptionsType | undefined;

    /** Plugin option default values. */
    private readonly defaultValues: RequiredPluginOptionsType = {
        type: "detailed",
        location: "local",
        remoteBaseUrl: "http://www.plantuml.com",
        format: "svg",
        sectionTitle: "Hierarchy-Diagram",
        position: "above",
        legendType: "only-included",
        methodParameterOutput: "complete",
        memberOrder: "public-to-private",
        hideEmptyMembers: true,
        topDownLayoutMaxSiblings: 6,
        visibilityStyle: "icon",
        hideCircledChar: false,
        hideShadow: false,
        boxBackgroundColor: "",
        boxBorderColor: "",
        boxBorderRadius: 0,
        boxBorderWidth: -1, // because 0 can be used to hide borders
        arrowColor: "",
        classFontName: "",
        classFontSize: 0,
        classFontStyle: "normal",
        classFontColor: "",
        attributeFontName: "",
        attributeFontSize: 0,
        attributeFontStyle: "normal",
        attributeFontColor: "",
        generatorProcessCount: os.cpus().length,
        hideProgressBar: false,
        createPlantUmlFiles: false,
        verboseOutput: false,
    };

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // eslint-disable-next-line class-methods-use-this
    public addToApplication(typedoc: Application): void {
        typedoc.options.addDeclaration({
            type: ParameterType.Mixed,
            name: "umlClassDiagram",
            help: "The object defining the options of the typedoc-umlclass plugin.",
        });
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param typedoc The TypeDoc application.
     */
    public readValuesFromApplication(typedoc: Application): void {
        this.userValues = typedoc.options.getValue("umlClassDiagram");
    }

    /**
     * Returns how detailed the generated class diagrams should be.
     * @returns How detailed the generated class diagrams should be.
     */
    public get type(): RequiredPluginOptionsType["type"] {
        return this.userValues?.type ?? this.defaultValues.type;
    }

    /**
     * Returns the location where the class diagrams should be stored.
     * @returns The location where the class diagrams should be stored.
     */
    public get location(): RequiredPluginOptionsType["location"] {
        return this.userValues?.location ?? this.defaultValues.location;
    }

    /**
     * Returns the base URL used when generating remote images.
     * @returns The base URL used when generating remote images.
     */
    public get remoteBaseUrl(): RequiredPluginOptionsType["remoteBaseUrl"] {
        return this.userValues?.remoteBaseUrl ?? this.defaultValues.remoteBaseUrl;
    }

    /**
     * Returns the image format used for the class diagrams.
     * @returns The image format used for the class diagrams.
     */
    public get format(): RequiredPluginOptionsType["format"] {
        return this.userValues?.format ?? this.defaultValues.format;
    }

    /**
     * Returns the title that should be used for the section that contains the class diagrams.
     * @returns The title that should be used for the section that contains the class diagrams.
     */
    public get sectionTitle(): RequiredPluginOptionsType["sectionTitle"] {
        return this.userValues?.sectionTitle ?? this.defaultValues.sectionTitle;
    }

    /**
     * Returns where on the page the class diagrams should be put.
     * @returns Where on the page the class diagrams should be put.
     */
    public get position(): RequiredPluginOptionsType["position"] {
        return this.userValues?.position ?? this.defaultValues.position;
    }

    /**
     * Returns the type of legend that should be generated for the class diagrams.
     * @returns The type of legend that should be generated for the class diagrams.
     */
    public get legendType(): RequiredPluginOptionsType["legendType"] {
        return this.userValues?.legendType ?? this.defaultValues.legendType;
    }

    /**
     * Returns how method parameters should be output in the class diagrams.
     * @returns How method parameters should be output in the class diagrams.
     */
    public get methodParameterOutput(): RequiredPluginOptionsType["methodParameterOutput"] {
        return this.userValues?.methodParameterOutput ?? this.defaultValues.methodParameterOutput;
    }

    /**
     * Returns how class members should be ordered in the class diagrams.
     * @returns How class members should be ordered the class diagrams.
     */
    public get memberOrder(): RequiredPluginOptionsType["memberOrder"] {
        return this.userValues?.memberOrder ?? this.defaultValues.memberOrder;
    }

    /**
     * Returns whether to hide empty properties and methods in the class diagrams.
     * @returns Whether to hide empty properties and methods in the class diagrams.
     */
    public get hideEmptyMembers(): RequiredPluginOptionsType["hideEmptyMembers"] {
        return this.userValues?.hideEmptyMembers ?? this.defaultValues.hideEmptyMembers;
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    public get topDownLayoutMaxSiblings(): RequiredPluginOptionsType["topDownLayoutMaxSiblings"] {
        return this.userValues?.topDownLayoutMaxSiblings ?? this.defaultValues.topDownLayoutMaxSiblings;
    }

    /**
     * Returns how the member visibility is rendered in the class diagrams.
     * @returns How the member visibility is rendered in the class diagrams.
     */
    public get visibilityStyle(): RequiredPluginOptionsType["visibilityStyle"] {
        return this.userValues?.visibilityStyle ?? this.defaultValues.visibilityStyle;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    public get hideCircledChar(): RequiredPluginOptionsType["hideCircledChar"] {
        return this.userValues?.hideCircledChar ?? this.defaultValues.hideCircledChar;
    }

    /**
     * Returns whether to hide the shadows in the class diagrams.
     * @returns Whether to hide the shadows in the class diagrams.
     */
    public get hideShadow(): RequiredPluginOptionsType["hideShadow"] {
        return this.userValues?.hideShadow ?? this.defaultValues.hideShadow;
    }

    /**
     * Returns the background color that should be used for boxes in the class diagrams.
     * @returns The background color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get boxBackgroundColor(): RequiredPluginOptionsType["boxBackgroundColor"] {
        return this.userValues?.boxBackgroundColor ?? this.defaultValues.boxBackgroundColor;
    }

    /**
     * Returns the border color that should be used for boxes in the class diagrams.
     * @returns The border color that should be used for boxes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get boxBorderColor(): RequiredPluginOptionsType["boxBorderColor"] {
        return this.userValues?.boxBorderColor ?? this.defaultValues.boxBorderColor;
    }

    /**
     * Returns the border radius that should be used for boxes in the class diagrams.
     * @returns The border radius that should be used for boxes in the class diagrams.
     */
    public get boxBorderRadius(): RequiredPluginOptionsType["boxBorderRadius"] {
        return this.userValues?.boxBorderRadius ?? this.defaultValues.boxBorderRadius;
    }

    /**
     * Returns the border width that should be used for boxes in the class diagrams.
     * @returns The border width that should be used for boxes in the class diagrams.
     *          The value -1 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get boxBorderWidth(): RequiredPluginOptionsType["boxBorderWidth"] {
        return this.userValues?.boxBorderWidth ?? this.defaultValues.boxBorderWidth;
    }

    /**
     * Returns the color that should be used for arrows in the class diagrams.
     * @returns The color that should be used for arrows in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get arrowColor(): RequiredPluginOptionsType["arrowColor"] {
        return this.userValues?.arrowColor ?? this.defaultValues.arrowColor;
    }

    /**
     * Returns the name of the font that should be used for the class name in the class diagrams.
     * @returns The name of the font that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classFontName(): RequiredPluginOptionsType["classFontName"] {
        return this.userValues?.classFontName ?? this.defaultValues.classFontName;
    }

    /**
     * Returns the font size that should be used for class names in the class diagrams.
     * @returns The font size that should be used for class names in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classFontSize(): RequiredPluginOptionsType["classFontSize"] {
        return this.userValues?.classFontSize ?? this.defaultValues.classFontSize;
    }

    /**
     * Returns the font style that should be used for the class name in the class diagrams.
     * @returns The font style that should be used for the class name in the class diagrams.
     */
    public get classFontStyle(): RequiredPluginOptionsType["classFontStyle"] {
        return this.userValues?.classFontStyle ?? this.defaultValues.classFontStyle;
    }

    /**
     * Returns the font color that should be used for the class name in the class diagrams.
     * @returns The font color that should be used for the class name in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get classFontColor(): RequiredPluginOptionsType["classFontColor"] {
        return this.userValues?.classFontColor ?? this.defaultValues.classFontColor;
    }

    /**
     * Returns the name of the font that should be used for class attributes in the class diagrams.
     * @returns The name of the font that should be used for class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontName(): RequiredPluginOptionsType["attributeFontName"] {
        return this.userValues?.attributeFontName ?? this.defaultValues.attributeFontName;
    }

    /**
     * Returns the font size that should be used for class attributes in the class diagrams.
     * @returns The font size that should be used for class attributes in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontSize(): RequiredPluginOptionsType["attributeFontSize"] {
        return this.userValues?.attributeFontSize ?? this.defaultValues.attributeFontSize;
    }

    /**
     * Returns the font style that should be used for the class attributes in the class diagrams.
     * @returns The font style that should be used for the class attributes in the class diagrams.
     */
    public get attributeFontStyle(): RequiredPluginOptionsType["attributeFontStyle"] {
        return this.userValues?.attributeFontStyle ?? this.defaultValues.attributeFontStyle;
    }

    /**
     * Returns the font color that should be used for the class attributes in the class diagrams.
     * @returns The font color that should be used for the class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontColor(): RequiredPluginOptionsType["attributeFontColor"] {
        return this.userValues?.attributeFontColor ?? this.defaultValues.attributeFontColor;
    }

    /**
     * Returns the number of PlantUML processes that should be used for generating the class diagrams.
     * @returns The number of PlantUML processes that should be used for generating the class diagrams.
     */
    public get generatorProcessCount(): RequiredPluginOptionsType["generatorProcessCount"] {
        const processCount = this.userValues?.generatorProcessCount ?? -1;
        return processCount <= 0 ? this.defaultValues.generatorProcessCount : processCount;
    }

    /**
     * Returns whether to hide the progress bar while generating the class diagrams.
     * @returns True, if the progress bar should not be displayed while generating the class diagrams, otherwise false.
     */
    public get hideProgressBar(): RequiredPluginOptionsType["hideProgressBar"] {
        return this.userValues?.hideProgressBar ?? this.defaultValues.hideProgressBar;
    }

    /**
     * Returns whether to create files containing the PlantUML code for the class diagrams.
     * @returns True, if files with the PlantUML code should be created, otherwise false.
     */
    public get createPlantUmlFiles(): RequiredPluginOptionsType["createPlantUmlFiles"] {
        return this.userValues?.createPlantUmlFiles ?? this.defaultValues.createPlantUmlFiles;
    }

    /**
     * Returns whether the plugin should output verbose info during its work.
     * @returns True, if plugin should create verbose output, otherwise false.
     */
    public get createVerboseOutput(): RequiredPluginOptionsType["verboseOutput"] {
        return this.userValues?.verboseOutput ?? this.defaultValues.verboseOutput;
    }
}
