import { cache } from "decorator-cache-getter";
import * as os from "os";
import { Application, ParameterType } from "typedoc";

// Custom utility type for nested required. Taken from: https://stackoverflow.com/a/67833840
type DeepRequired<T> = { [K in keyof T]: DeepRequired<T[K]> } & Required<T>;

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
            width?: number;
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
type RequiredPluginConfig = DeepRequired<PluginConfig>;

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

    /**
     * Returns how detailed the generated class diagrams should be.
     * @returns How detailed the generated class diagrams should be.
     */
    @cache
    public get type(): RequiredPluginConfig["type"] {
        return this.userValues?.type ?? "detailed";
    }

    /**
     * Returns the location where the class diagrams should be stored.
     * @returns The location where the class diagrams should be stored.
     */
    @cache
    public get location(): RequiredPluginConfig["location"] {
        return this.userValues?.location ?? "local";
    }

    /**
     * Returns the base URL used when generating remote images.
     * @returns The base URL used when generating remote images.
     */
    @cache
    public get remoteBaseUrl(): RequiredPluginConfig["remoteBaseUrl"] {
        return this.userValues?.remoteBaseUrl ?? "http://www.plantuml.com";
    }

    /**
     * Returns the image format used for the class diagrams.
     * @returns The image format used for the class diagrams.
     */
    @cache
    public get format(): RequiredPluginConfig["format"] {
        return this.userValues?.format ?? "svg";
    }

    /**
     * Returns the title that should be used for the section that contains the class diagrams.
     * @returns The title that should be used for the section that contains the class diagrams.
     */
    @cache
    public get sectionTitle(): RequiredPluginConfig["sectionTitle"] {
        return this.userValues?.sectionTitle ?? "Hierarchy-Diagram";
    }

    /**
     * Returns where on the page the class diagrams should be put.
     * @returns Where on the page the class diagrams should be put.
     */
    @cache
    public get position(): RequiredPluginConfig["position"] {
        return this.userValues?.position ?? "above";
    }

    /**
     * Returns the type of legend that should be generated for the class diagrams.
     * @returns The type of legend that should be generated for the class diagrams.
     */
    @cache
    public get legendType(): RequiredPluginConfig["legendType"] {
        return this.userValues?.legendType ?? "only-included";
    }

    /**
     * Returns how method parameters should be output in the class diagrams.
     * @returns How method parameters should be output in the class diagrams.
     */
    @cache
    public get methodParameterOutput(): RequiredPluginConfig["methodParameterOutput"] {
        return this.userValues?.methodParameterOutput ?? "complete";
    }

    /**
     * Returns how class members should be ordered in the class diagrams.
     * @returns How class members should be ordered the class diagrams.
     */
    @cache
    public get memberOrder(): RequiredPluginConfig["memberOrder"] {
        return this.userValues?.memberOrder ?? "public-to-private";
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    @cache
    public get topDownLayoutMaxSiblings(): RequiredPluginConfig["topDownLayoutMaxSiblings"] {
        return this.userValues?.topDownLayoutMaxSiblings ?? 6;
    }

    /**
     * Returns how the member visibility is rendered in the class diagrams.
     * @returns How the member visibility is rendered in the class diagrams.
     */
    @cache
    public get visibilityStyle(): RequiredPluginConfig["visibilityStyle"] {
        return this.userValues?.visibilityStyle ?? "icon";
    }

    /**
     * Returns whether to hide empty properties and methods in the class diagrams.
     * @returns Whether to hide empty properties and methods in the class diagrams.
     */
    @cache
    public get hideEmptyMembers(): RequiredPluginConfig["hideEmptyMembers"] {
        return this.userValues?.hideEmptyMembers ?? true;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    @cache
    public get hideCircledChar(): RequiredPluginConfig["hideCircledChar"] {
        return this.userValues?.hideCircledChar ?? false;
    }

    /**
     * Returns whether to hide the shadows in the class diagrams.
     * @returns Whether to hide the shadows in the class diagrams.
     */
    @cache
    public get hideShadow(): RequiredPluginConfig["hideShadow"] {
        return this.userValues?.hideShadow ?? false;
    }

    /**
     * Returns the color that should be used for the background of all class diagrams.
     * @returns The color that should be used for the background of all class diagrams.
     */
    @cache
    public get backgroundColor(): RequiredPluginConfig["style"]["backgroundColor"] {
        return this.userValues?.style?.backgroundColor ?? "transparent";
    }

    /**
     * Returns the style that should be used for boxes in the class diagrams.
     * @returns The style that should be used for boxes in the class diagrams.
     */
    @cache
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
    @cache
    public get arrow(): RequiredPluginConfig["style"]["arrow"] {
        const userArrowtyle = this.userValues?.style?.arrow;
        return {
            width: userArrowtyle?.width ?? -1,
            color: userArrowtyle?.color ?? "",
        };
    }

    /**
     * Returns the style that should be used for classes in the class diagrams.
     * @returns The style that should be used for classes in the class diagrams.
     */
    @cache
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
     * Returns the style that should be used for interfaces in the class diagrams.
     * @returns The style that should be used for interfaces in the class diagrams.
     */
    @cache
    public get interface(): RequiredPluginConfig["style"]["interface"] {
        const userTextStyle = this.userValues?.style?.text;
        const userInterfaceStyle = this.userValues?.style?.interface;
        return {
            name: {
                font: {
                    family: userInterfaceStyle?.name?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userInterfaceStyle?.name?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userInterfaceStyle?.name?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userInterfaceStyle?.name?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userInterfaceStyle?.name?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userInterfaceStyle?.name?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userInterfaceStyle?.name?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userInterfaceStyle?.name?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
        };
    }

    /**
     * Returns the style that should be used for properties in the class diagrams.
     * @returns The style that should be used for properties in the class diagrams.
     */
    @cache
    public get property(): RequiredPluginConfig["style"]["property"] {
        const userTextStyle = this.userValues?.style?.text;
        const userPropertyStyle = this.userValues?.style?.property;
        return {
            name: {
                font: {
                    family: userPropertyStyle?.name?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userPropertyStyle?.name?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userPropertyStyle?.name?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userPropertyStyle?.name?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userPropertyStyle?.name?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userPropertyStyle?.name?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userPropertyStyle?.name?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userPropertyStyle?.name?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
            type: {
                font: {
                    family: userPropertyStyle?.type?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userPropertyStyle?.type?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userPropertyStyle?.type?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userPropertyStyle?.type?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userPropertyStyle?.type?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userPropertyStyle?.type?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userPropertyStyle?.type?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userPropertyStyle?.type?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
        };
    }

    /**
     * Returns the style that should be used for properties in the class diagrams.
     * @returns The style that should be used for properties in the class diagrams.
     */
    @cache
    public get method(): RequiredPluginConfig["style"]["method"] {
        const userTextStyle = this.userValues?.style?.text;
        const userMethodStyle = this.userValues?.style?.method;
        return {
            name: {
                font: {
                    family: userMethodStyle?.name?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userMethodStyle?.name?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userMethodStyle?.name?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userMethodStyle?.name?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userMethodStyle?.name?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userMethodStyle?.name?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userMethodStyle?.name?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userMethodStyle?.name?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
            parameter: {
                name: {
                    font: {
                        family: userMethodStyle?.parameter?.name?.font?.family ?? userTextStyle?.font?.family ?? "",
                        size: userMethodStyle?.parameter?.name?.font?.size ?? userTextStyle?.font?.size ?? 0,
                        bold: userMethodStyle?.parameter?.name?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                        italic: userMethodStyle?.parameter?.name?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                        underline:
                            userMethodStyle?.parameter?.name?.font?.underline ??
                            userTextStyle?.font?.underline ??
                            false,
                        strikeout:
                            userMethodStyle?.parameter?.name?.font?.strikeout ??
                            userTextStyle?.font?.strikeout ??
                            false,
                    },
                    color: userMethodStyle?.parameter?.name?.color ?? userTextStyle?.color ?? "",
                    backgroundColor:
                        userMethodStyle?.parameter?.name?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
                },
                type: {
                    font: {
                        family: userMethodStyle?.parameter?.type?.font?.family ?? userTextStyle?.font?.family ?? "",
                        size: userMethodStyle?.parameter?.type?.font?.size ?? userTextStyle?.font?.size ?? 0,
                        bold: userMethodStyle?.parameter?.type?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                        italic: userMethodStyle?.parameter?.type?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                        underline:
                            userMethodStyle?.parameter?.type?.font?.underline ??
                            userTextStyle?.font?.underline ??
                            false,
                        strikeout:
                            userMethodStyle?.parameter?.type?.font?.strikeout ??
                            userTextStyle?.font?.strikeout ??
                            false,
                    },
                    color: userMethodStyle?.parameter?.type?.color ?? userTextStyle?.color ?? "",
                    backgroundColor:
                        userMethodStyle?.parameter?.type?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
                },
            },
            returnType: {
                font: {
                    family: userMethodStyle?.returnType?.font?.family ?? userTextStyle?.font?.family ?? "",
                    size: userMethodStyle?.returnType?.font?.size ?? userTextStyle?.font?.size ?? 0,
                    bold: userMethodStyle?.returnType?.font?.bold ?? userTextStyle?.font?.bold ?? false,
                    italic: userMethodStyle?.returnType?.font?.italic ?? userTextStyle?.font?.italic ?? false,
                    underline: userMethodStyle?.returnType?.font?.underline ?? userTextStyle?.font?.underline ?? false,
                    strikeout: userMethodStyle?.returnType?.font?.strikeout ?? userTextStyle?.font?.strikeout ?? false,
                },
                color: userMethodStyle?.returnType?.color ?? userTextStyle?.color ?? "",
                backgroundColor: userMethodStyle?.returnType?.backgroundColor ?? userTextStyle?.backgroundColor ?? "",
            },
        };
    }

    /**
     * Returns the number of PlantUML processes that should be used for generating the class diagrams.
     * @returns The number of PlantUML processes that should be used for generating the class diagrams.
     */
    @cache
    public get generatorProcessCount(): RequiredPluginConfig["generatorProcessCount"] {
        const processCount = this.userValues?.generatorProcessCount ?? -1;
        return processCount <= 0 ? os.cpus().length : processCount;
    }

    /**
     * Returns whether to hide the progress bar while generating the class diagrams.
     * @returns True, if the progress bar should not be displayed while generating the class diagrams, otherwise false.
     */
    @cache
    public get hideProgressBar(): RequiredPluginConfig["hideProgressBar"] {
        return this.userValues?.hideProgressBar ?? false;
    }

    /**
     * Returns whether to create files containing the PlantUML code for the class diagrams.
     * @returns True, if files with the PlantUML code should be created, otherwise false.
     */
    @cache
    public get createPlantUmlFiles(): RequiredPluginConfig["createPlantUmlFiles"] {
        return this.userValues?.createPlantUmlFiles ?? false;
    }

    /**
     * Returns whether the plugin should output verbose info during its work.
     * @returns True, if plugin should create verbose output, otherwise false.
     */
    @cache
    public get createVerboseOutput(): RequiredPluginConfig["verboseOutput"] {
        return this.userValues?.verboseOutput ?? false;
    }

    /**
     * Returns whether any text should be styled with an italic font.
     * @returns True if anything should be styled with an italic font, otherwise false.
     */
    @cache
    public get isAnythingStyledItalic(): boolean {
        return (
            (this.userValues?.style?.text?.font?.italic ?? false) ||
            this.class.name.font.italic ||
            this.interface.name.font.italic ||
            this.property.name.font.italic ||
            this.property.type.font.italic ||
            this.method.name.font.italic ||
            this.method.parameter.name.font.italic ||
            this.method.parameter.type.font.italic ||
            this.method.returnType.font.italic
        );
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
