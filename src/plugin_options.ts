import * as os from "os";
import { Application, ParameterType } from "typedoc";

/** Type for specifying the style of a text. */
type TextStyle = {
    font?: {
        family?: string;
        size?: number;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikeout?: boolean;
    };
    color?: string;
    backgroundColor?: string;
};

/**
 * Type defining all options and their possible values of the plugin.
 */
export type PluginConfig = {
    type?: "none" | "simple" | "detailed";
    location?: "local" | "remote" | "embed";
    remoteBaseUrl?: string;
    format?: "png" | "svg";
    sectionTitle?: string;
    position?: "above" | "below";
    legendType?: "none" | "only-included" | "full";
    methodParameterOutput?: "none" | "only-names" | "only-types" | "complete";
    memberOrder?: "abc" | "public-to-private" | "private-to-public";
    topDownLayoutMaxSiblings?: number;
    visibilityStyle?: "text" | "icon";
    hideEmptyMembers?: boolean;
    hideCircledChar?: boolean;
    hideShadow?: boolean;
    style?: {
        backgroundColor?: string;
        box?: {
            backgroundColor?: string;
            border?: {
                width?: number;
                color?: string;
                radius?: number;
            };
        };
        arrow?: {
            color?: string;
        };
        text?: TextStyle;
        class?: {
            name?: TextStyle;
        };
        interface?: {
            name?: TextStyle;
        };
        property?: {
            name?: TextStyle;
            type?: TextStyle;
        };
        method?: {
            name?: TextStyle;
            parameter?: {
                name?: TextStyle;
                type?: TextStyle;
            };
            returnType?: TextStyle;
        };
    };
    generatorProcessCount?: number;
    hideProgressBar?: boolean;
    createPlantUmlFiles?: boolean;
    verboseOutput?: boolean;
};

/** Plugin options type without nullables. */
type RequiredPluginConfig = Required<PluginConfig>;

/**
 * Extend typedoc's options with the plugin's option using declaration merging.
 */
declare module "typedoc" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- This is not a separate type.
    export interface TypeDocOptionMap {
        umlClassDiagram?: PluginConfig;
    }
}

/**
 * Class storing the options of the plugin.
 */
export class PluginOptions {
    /** Plugin option values as provided by the user. */
    private userValues: PluginConfig | undefined;

    // /** Plugin option default values. */
    // private readonly defaultValues: RequiredPluginConfig = {

    //     style?: {

    //         arrow: {
    //             color: "",
    //         },
    //         text: {
    //             font?: {
    //                 family?: string;
    //                 size?: number;
    //                 bold?: boolean;
    //                 italic?: boolean;
    //                 underline?: boolean;
    //                 strikeout?: boolean;
    //             };
    //             color?: string;
    //             backgroundColor?: string;
    //         };
    //         class?: {
    //             name?: TextStyle;
    //         };
    //         interface?: {
    //             name?: TextStyle;
    //         };
    //         property?: {
    //             name?: TextStyle;
    //             type?: TextStyle;
    //         };
    //         method?: {
    //             name?: TextStyle;
    //             parameter?: {
    //                 name?: TextStyle;
    //                 type?: TextStyle;
    //             };
    //             returnType?: TextStyle;
    //         };

    //     };

    //     classFontName: "",
    //     classFontSize: 0,
    //     classFontStyle: "normal",
    //     classFontColor: "",
    //     attributeFontName: "",
    //     attributeFontSize: 0,
    //     attributeFontStyle: "normal",
    //     attributeFontColor: "",
    // };

    /**
     * Returns how detailed the generated class diagrams should be.
     * @returns How detailed the generated class diagrams should be.
     */
    public get type(): RequiredPluginConfig["type"] {
        return this.userValues?.type ?? "detailed";
    }

    /**
     * Returns the location where the class diagrams should be stored.
     * @returns The location where the class diagrams should be stored.
     */
    public get location(): RequiredPluginConfig["location"] {
        return this.userValues?.location ?? "local";
    }

    /**
     * Returns the base URL used when generating remote images.
     * @returns The base URL used when generating remote images.
     */
    public get remoteBaseUrl(): RequiredPluginConfig["remoteBaseUrl"] {
        return this.userValues?.remoteBaseUrl ?? "http://www.plantuml.com";
    }

    /**
     * Returns the image format used for the class diagrams.
     * @returns The image format used for the class diagrams.
     */
    public get format(): RequiredPluginConfig["format"] {
        return this.userValues?.format ?? "svg";
    }

    /**
     * Returns the title that should be used for the section that contains the class diagrams.
     * @returns The title that should be used for the section that contains the class diagrams.
     */
    public get sectionTitle(): RequiredPluginConfig["sectionTitle"] {
        return this.userValues?.sectionTitle ?? "Hierarchy-Diagram";
    }

    /**
     * Returns where on the page the class diagrams should be put.
     * @returns Where on the page the class diagrams should be put.
     */
    public get position(): RequiredPluginConfig["position"] {
        return this.userValues?.position ?? "above";
    }

    /**
     * Returns the type of legend that should be generated for the class diagrams.
     * @returns The type of legend that should be generated for the class diagrams.
     */
    public get legendType(): RequiredPluginConfig["legendType"] {
        return this.userValues?.legendType ?? "only-included";
    }

    /**
     * Returns how method parameters should be output in the class diagrams.
     * @returns How method parameters should be output in the class diagrams.
     */
    public get methodParameterOutput(): RequiredPluginConfig["methodParameterOutput"] {
        return this.userValues?.methodParameterOutput ?? "complete";
    }

    /**
     * Returns how class members should be ordered in the class diagrams.
     * @returns How class members should be ordered the class diagrams.
     */
    public get memberOrder(): RequiredPluginConfig["memberOrder"] {
        return this.userValues?.memberOrder ?? "public-to-private";
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    public get topDownLayoutMaxSiblings(): RequiredPluginConfig["topDownLayoutMaxSiblings"] {
        return this.userValues?.topDownLayoutMaxSiblings ?? 6;
    }

    /**
     * Returns how the member visibility is rendered in the class diagrams.
     * @returns How the member visibility is rendered in the class diagrams.
     */
    public get visibilityStyle(): RequiredPluginConfig["visibilityStyle"] {
        return this.userValues?.visibilityStyle ?? "icon";
    }

    /**
     * Returns whether to hide empty properties and methods in the class diagrams.
     * @returns Whether to hide empty properties and methods in the class diagrams.
     */
    public get hideEmptyMembers(): RequiredPluginConfig["hideEmptyMembers"] {
        return this.userValues?.hideEmptyMembers ?? true;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    public get hideCircledChar(): RequiredPluginConfig["hideCircledChar"] {
        return this.userValues?.hideCircledChar ?? false;
    }

    /**
     * Returns whether to hide the shadows in the class diagrams.
     * @returns Whether to hide the shadows in the class diagrams.
     */
    public get hideShadow(): RequiredPluginConfig["hideShadow"] {
        return this.userValues?.hideShadow ?? false;
    }

    /**
     * Returns the color that should be used for the background of all class diagrams.
     * @returns The color that should be used for the background of all class diagrams.
     */
    public get backgroundColor(): RequiredPluginConfig["style"]["backgroundColor"] {
        return this.userValues?.style?.backgroundColor ?? "transparent";
    }

    /**
     * Returns the style that should be used for boxes in the class diagrams.
     * @returns The style that should be used for boxes in the class diagrams.
     */
    public get box(): RequiredPluginConfig["style"]["box"] {
        const userBoxStyle = this.userValues?.style?.box;
        return {
            backgroundColor: userBoxStyle?.backgroundColor ?? "",
            border: {
                width: userBoxStyle?.border?.width ?? -1, // because 0 can be used to hide borders
                color: userBoxStyle?.border?.color ?? "",
                radius: userBoxStyle?.border?.radius ?? 0,
            },
        };
    }

    /**
     * Returns the style that should be used for arrows in the class diagrams.
     * @returns The style that should be used for arrows in the class diagrams.
     */
    public get arrow(): RequiredPluginConfig["style"]["arrow"] {
        const userArrowtyle = this.userValues?.style?.arrow;
        return {
            color: userArrowtyle?.color ?? "",
        };
    }

    /**
     * Returns the style that should be used for the class names in the class diagrams.
     * @returns The style that should be used for the class names in the class diagrams.
     */
    public get class(): RequiredPluginConfig["style"]["class"] {
        const userTextStyle = this.userValues?.style?.text;
        const userClassStyle = this.userValues?.style?.class;
        return {
            name: {
                font: {
                    family: userClassStyle?.name?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userClassStyle?.name?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userClassStyle?.name?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userClassStyle?.name?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userClassStyle?.name?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userClassStyle?.name?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userClassStyle?.name?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userClassStyle?.name?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
        };
    }

    /**
     * Returns the name of the font that should be used for class attributes in the class diagrams.
     * @returns The name of the font that should be used for class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontName(): RequiredPluginConfig["attributeFontName"] {
        return this.userValues?.attributeFontName ?? this.defaultValues.attributeFontName;
    }

    /**
     * Returns the font size that should be used for class attributes in the class diagrams.
     * @returns The font size that should be used for class attributes in the class diagrams.
     *          The value 0 if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontSize(): RequiredPluginConfig["attributeFontSize"] {
        return this.userValues?.attributeFontSize ?? this.defaultValues.attributeFontSize;
    }

    /**
     * Returns the font style that should be used for the class attributes in the class diagrams.
     * @returns The font style that should be used for the class attributes in the class diagrams.
     */
    public get attributeFontStyle(): RequiredPluginConfig["attributeFontStyle"] {
        return this.userValues?.attributeFontStyle ?? this.defaultValues.attributeFontStyle;
    }

    /**
     * Returns the font color that should be used for the class attributes in the class diagrams.
     * @returns The font color that should be used for the class attributes in the class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    public get attributeFontColor(): RequiredPluginConfig["attributeFontColor"] {
        return this.userValues?.attributeFontColor ?? this.defaultValues.attributeFontColor;
    }

    /**
     * Returns the number of PlantUML processes that should be used for generating the class diagrams.
     * @returns The number of PlantUML processes that should be used for generating the class diagrams.
     */
    public get generatorProcessCount(): RequiredPluginConfig["generatorProcessCount"] {
        const processCount = this.userValues?.generatorProcessCount ?? -1;
        return processCount <= 0 ? os.cpus().length : processCount;
    }

    /**
     * Returns whether to hide the progress bar while generating the class diagrams.
     * @returns True, if the progress bar should not be displayed while generating the class diagrams, otherwise false.
     */
    public get hideProgressBar(): RequiredPluginConfig["hideProgressBar"] {
        return this.userValues?.hideProgressBar ?? false;
    }

    /**
     * Returns whether to create files containing the PlantUML code for the class diagrams.
     * @returns True, if files with the PlantUML code should be created, otherwise false.
     */
    public get createPlantUmlFiles(): RequiredPluginConfig["createPlantUmlFiles"] {
        return this.userValues?.createPlantUmlFiles ?? false;
    }

    /**
     * Returns whether the plugin should output verbose info during its work.
     * @returns True, if plugin should create verbose output, otherwise false.
     */
    public get createVerboseOutput(): RequiredPluginConfig["verboseOutput"] {
        return this.userValues?.verboseOutput ?? false;
    }

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
}
