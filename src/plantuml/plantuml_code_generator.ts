import {
    DeclarationReflection,
    ParameterReflection,
    ReferenceType,
    ReflectionFlags,
    ReflectionKind,
    SignatureReflection,
    Type,
    TypeParameterReflection,
} from "typedoc";
import {
    nameAbc,
    privateToPublic,
    publicToPrivate,
    TypeDocMemberCompareFunction,
} from "../typedoc/typedoc_member_sorter";
import {
    getExtendedBysForReflection,
    getExtendedTypesForReflection,
    getImplementedBysForReflection,
    getImplementedTypesForReflection,
} from "../typedoc/typedoc_utils";

/** Type for specifying the style of a text. */
type TextStyle = {
    font: {
        family: string;
        size: number;
        bold: boolean;
        italic: boolean;
        underline: boolean;
        strikeout: boolean;
    };
    color: string;
    backgroundColor: string;
};

/**
 * Options for the PlantUmlGenerator.
 */
export type PlantUmlCodeGeneratorOptions = {
    type: "none" | "simple" | "detailed";
    methodParameterOutput: "none" | "only-names" | "only-types" | "complete";
    memberOrder: "abc" | "public-to-private" | "private-to-public";
    topDownLayoutMaxSiblings: number;
    visibilityStyle: "text" | "icon";
    hideEmptyMembers: boolean;
    hideCircledChar: boolean;
    hideShadow: boolean;
    diagramBackgroundColor: string;
    boxBackgroundColor: string;
    boxBorderWidth: number;
    boxBorderColor: string;
    boxBorderRadius: number;
    arrowWidth: number;
    arrowColor: string;
    className: TextStyle;
    interfaceName: TextStyle;
    propertyName: TextStyle;
    propertyType: TextStyle;
    methodName: TextStyle;
    methodParameterName: TextStyle;
    methodParameterType: TextStyle;
    methodReturnType: TextStyle;
};

/**
 * Class that generates PlantUML code.
 */
export class PlantUmlCodeGenerator {
    /** The options for the PlantUML output. */
    private readonly options: PlantUmlCodeGeneratorOptions;

    /** Compare function used for sorting class members. */
    private readonly classMemberCompareFunction: TypeDocMemberCompareFunction;

    /**
     * Creates a new PlantUmlGenerator object with the given options.
     * @param options The options for the PlantUML output.
     */
    public constructor(options: Readonly<PlantUmlCodeGeneratorOptions>) {
        this.options = options;

        if (this.options.memberOrder === "public-to-private") {
            this.classMemberCompareFunction = publicToPrivate;
        } else if (this.options.memberOrder === "private-to-public") {
            this.classMemberCompareFunction = privateToPublic;
        } else {
            this.classMemberCompareFunction = nameAbc;
        }
    }

    /**
     * Generates the Plant UML lines for the class diagram of the given reflection.
     * @param reflection The reflection for which to generate a class diagram.
     * @returns The Plant UML lines for the class diagram of the given reflection.
     *          If the given reflection is not part of an inheritance or implementation, the result is an empty array.
     */
    public createClassDiagramPlantUmlForReflection(reflection: Readonly<DeclarationReflection>): string[] {
        let plantUmlLines = new Array<string>();
        let siblingsAbove = 0;
        let siblingsBelow = 0;

        // add class/interface
        const reflectionName = PlantUmlCodeGenerator.getFullReflectionName(reflection);
        plantUmlLines = plantUmlLines.concat(this.createPlantUmlForReflection(reflection));

        // add classes/interfaces this type is extending
        const extendedTypes = getExtendedTypesForReflection(reflection);

        for (const extendedType of extendedTypes) {
            const extendedTypeName = PlantUmlCodeGenerator.getFullTypeName(extendedType);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedType));
            plantUmlLines.push(
                PlantUmlCodeGenerator.escapeName(extendedTypeName) +
                    " <|-- " +
                    PlantUmlCodeGenerator.escapeName(reflectionName),
            );

            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        const implementedTypes = getImplementedTypesForReflection(reflection);

        for (const implementedType of implementedTypes) {
            const implementedTypeName = PlantUmlCodeGenerator.getFullTypeName(implementedType);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedType));
            plantUmlLines.push(
                PlantUmlCodeGenerator.escapeName(implementedTypeName) +
                    " <|.. " +
                    PlantUmlCodeGenerator.escapeName(reflectionName),
            );

            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        const extendedBys = getExtendedBysForReflection(reflection);

        for (const extendedBy of extendedBys) {
            const extendedByName = PlantUmlCodeGenerator.getFullTypeName(extendedBy);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedBy));
            plantUmlLines.push(
                PlantUmlCodeGenerator.escapeName(reflectionName) +
                    " <|-- " +
                    PlantUmlCodeGenerator.escapeName(extendedByName),
            );

            ++siblingsBelow;
        }

        // add classes that are implementing this type
        const implementedBys = getImplementedBysForReflection(reflection);

        for (const implementedBy of implementedBys) {
            const implementedByName = PlantUmlCodeGenerator.getFullTypeName(implementedBy);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedBy));
            plantUmlLines.push(
                PlantUmlCodeGenerator.escapeName(reflectionName) +
                    " <|.. " +
                    PlantUmlCodeGenerator.escapeName(implementedByName),
            );

            ++siblingsBelow;
        }

        plantUmlLines.unshift(...this.getDiagramFormatCommands(siblingsAbove, siblingsBelow));
        plantUmlLines.unshift(...this.getBoxFormatCommands());
        plantUmlLines.unshift(...this.getClassNameFormatCommands());
        plantUmlLines.unshift(...this.getInterfaceNameFormatCommands());

        return ["@startuml", ...plantUmlLines, "@enduml"];
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a reflection.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param typeArguments Possible type arguments if the reflection is based on a template class.
     * @param isType Specifies whether the reflection belongs to a type. This parameter is necessary to distinguish
     *               between a template class and a type based on the template class, because missing typeArguments
     *               can either mean that the default types for all type parameters are used for the type or that the
     *               reflection stands for a template class.
     * @returns The PlantUML lines for the reflection.
     */
    protected createPlantUmlForReflection(
        reflection: Readonly<DeclarationReflection>,
        typeArguments?: ReadonlyArray<Type>,
        isType = false,
    ): string[] {
        // Build type parameter map used in the methods below
        const typeParamsMap =
            reflection.typeParameters && isType
                ? PlantUmlCodeGenerator.createTypeParameterMapping(reflection.typeParameters, typeArguments)
                : new Map<string, string>();

        // Build PlantUML code
        const plantUmlLines = new Array<string>();

        plantUmlLines.push(PlantUmlCodeGenerator.createPlantUmlForClassOrInterface(reflection, typeParamsMap) + " {");

        if (this.options.type === "detailed" && reflection.children) {
            // Process properties
            const props = reflection.children
                .filter((c: Readonly<DeclarationReflection>) => c.kind === ReflectionKind.Property)
                .sort(this.classMemberCompareFunction);

            for (const prop of props) {
                plantUmlLines.push(this.createPlantUmlForProperty(prop, typeParamsMap));
            }

            // Process method signatures
            const methods = reflection.children
                .filter((c: Readonly<DeclarationReflection>) => c.kind === ReflectionKind.Method)
                .sort(this.classMemberCompareFunction);

            for (const method of methods) {
                if (method.signatures) {
                    for (const signature of method.signatures) {
                        plantUmlLines.push(
                            this.createPlantUmlForMethodSignature(method.flags, signature, typeParamsMap),
                        );
                    }
                }
            }
        }

        plantUmlLines.push("}");

        return plantUmlLines;
    }

    /**
     * Returns a list of PlantUML commands to format the diagram using the current options.
     * @param siblingsAbove The number of siblings above the element the diagram is generated for.
     * @param siblingsBelow The number of siblings below the element the diagram is generated for.
     * @returns The PlantUML commands to format the diagram.
     */
    private getDiagramFormatCommands(siblingsAbove: number, siblingsBelow: number): string[] {
        const commands = new Array<string>();

        if (this.options.hideEmptyMembers) {
            commands.push("hide empty fields");
            commands.push("hide empty methods");
        }

        if (this.options.hideCircledChar) {
            commands.push("hide circle");
        }

        if (
            siblingsAbove > this.options.topDownLayoutMaxSiblings ||
            siblingsBelow > this.options.topDownLayoutMaxSiblings
        ) {
            commands.push("left to right direction");
        }

        if (this.options.visibilityStyle === "text") {
            commands.push("skinparam ClassAttributeIconSize 0");
        }

        if (this.options.hideShadow) {
            commands.push("skinparam Shadowing false");
        } else {
            commands.push("skinparam Shadowing true");
        }

        if (this.options.diagramBackgroundColor) {
            commands.push("skinparam BackgroundColor " + this.options.diagramBackgroundColor);
        }

        if (this.options.arrowWidth >= 0) {
            commands.push("skinparam ClassArrowThickness " + this.options.arrowWidth);
        }

        if (this.options.arrowColor) {
            commands.push("skinparam ClassArrowColor " + this.options.arrowColor);
        }

        return commands;
    }

    /**
     * Returns a list of PlantUML commands to format the boxes using the current options.
     * @returns The PlantUML commands to format the boxes.
     */
    private getBoxFormatCommands(): string[] {
        const commands = new Array<string>();

        if (this.options.boxBackgroundColor) {
            commands.push("skinparam ClassBackgroundColor " + this.options.boxBackgroundColor);
        }
        if (this.options.boxBorderColor) {
            commands.push("skinparam ClassBorderColor " + this.options.boxBorderColor);
        }
        if (this.options.boxBorderRadius >= 0) {
            commands.push(`skinparam RoundCorner ${this.options.boxBorderRadius}`);
        }
        if (this.options.boxBorderWidth >= 0) {
            commands.push(`skinparam ClassBorderThickness ${this.options.boxBorderWidth}`);
        }

        return commands;
    }

    /**
     * Returns a list of PlantUML commands to format the class names using the current options.
     * @returns The PlantUML commands to format the class names.
     */
    private getClassNameFormatCommands(): string[] {
        const commands = new Array<string>();

        // Here we use skinparam commands because Creole and legacy HTML formating
        // is not supported for class names by PlantUML.
        if (this.options.className.color) {
            commands.push("skinparam ClassFontColor " + this.options.className.color);
        }
        if (this.options.className.font.family) {
            commands.push("skinparam ClassFontName " + this.options.className.font.family);
        }
        if (this.options.className.font.bold) {
            commands.push("skinparam ClassFontStyle bold");
        }
        if (this.options.className.font.italic) {
            commands.push("skinparam ClassFontStyle italic");
        }
        if (this.options.className.font.size > 0) {
            commands.push("skinparam ClassFontSize " + this.options.className.font.size);
        }

        return commands;
    }

    /**
     * Returns a list of PlantUML commands to format the interface names using the current options.
     * @returns The PlantUML commands to format the interface names.
     */
    private getInterfaceNameFormatCommands(): string[] {
        const commands = new Array<string>();

        // Here we use skinparam commands because Creole and legacy HTML formating
        // is not supported for interface names by PlantUML.
        if (this.options.interfaceName.color) {
            commands.push("skinparam InterfaceFontColor " + this.options.interfaceName.color);
        }
        if (this.options.interfaceName.font.family) {
            commands.push("skinparam InterfaceFontName " + this.options.interfaceName.font.family);
        }
        if (this.options.interfaceName.font.bold) {
            commands.push("skinparam InterfaceFontStyle bold");
        }
        if (this.options.interfaceName.font.italic) {
            commands.push("skinparam InterfaceFontStyle italic");
        }
        if (this.options.interfaceName.font.size > 0) {
            commands.push("skinparam InterfaceFontSize " + this.options.interfaceName.font.size);
        }

        return commands;
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a type.
     * @param type The type for which the PlantUML should be generated.
     * @returns The PlantUML lines for the type.
     */
    private createPlantUmlForType(type: Readonly<ReferenceType>): string[] {
        const reflection = type.reflection;

        if (
            reflection &&
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface)
        ) {
            return this.createPlantUmlForReflection(reflection, type.typeArguments, true);
        }

        return PlantUmlCodeGenerator.createDummyPlantUmlForType(type);
    }

    /**
     * Returns the PlantUML line for generating the output for a given method.
     * @param methodFlags Flags for the method the signature belongs to.
     * @param signature Data about the method signature.
     * @param typeParamsMap If the method belongs to a class which has type arguments this map contains the mapping of
     *                      the type parameters to their type arguments.
     * @returns The PlantUML line for the given method.
     */
    private createPlantUmlForMethodSignature(
        methodFlags: Readonly<ReflectionFlags>,
        signature: Readonly<SignatureReflection>,
        typeParamsMap: ReadonlyMap<string, string>,
    ): string {
        let plantUml = "    "; // indent

        if (methodFlags.isStatic) {
            plantUml += "{static} ";
        }

        if (methodFlags.isAbstract) {
            plantUml += "{abstract} ";
        }

        if (methodFlags.isPrivate) {
            plantUml += "-";
        } else if (methodFlags.isProtected) {
            plantUml += "#";
        } else {
            plantUml += "+"; // public is default for JS/TS
        }

        plantUml += PlantUmlCodeGenerator.formatText(signature.name, this.options.methodName);

        // Type-parameters
        const localTypeParamsMap = new Map(typeParamsMap);

        if (signature.typeParameters && signature.typeParameters.length > 0) {
            plantUml += "<";
            plantUml += signature.typeParameters.map((p: Readonly<TypeParameterReflection>) => p.name).join(", ");
            plantUml += ">";

            // Remove type parameters of signature from type parameter/argument mapping of class
            signature.typeParameters.forEach((p: Readonly<TypeParameterReflection>) => {
                localTypeParamsMap.delete(p.name);
            });
        }

        // Arguments
        plantUml += "(";

        if (signature.parameters) {
            if (this.options.methodParameterOutput === "only-names") {
                plantUml += signature.parameters
                    .map((p: Readonly<ParameterReflection>) =>
                        PlantUmlCodeGenerator.formatText(p.name, this.options.methodParameterName),
                    )
                    .join(", ");
            } else if (this.options.methodParameterOutput === "only-types") {
                plantUml += signature.parameters
                    .map((p: Readonly<ParameterReflection>) =>
                        PlantUmlCodeGenerator.formatText(
                            p.type
                                ? PlantUmlCodeGenerator.getTypeNameWithReplacedTypeParameters(
                                      p.type,
                                      localTypeParamsMap,
                                  )
                                : "unknown",
                            this.options.methodParameterType,
                        ),
                    )
                    .join(", ");
            } else if (this.options.methodParameterOutput === "complete") {
                plantUml += signature.parameters
                    .map(
                        (p: Readonly<ParameterReflection>) =>
                            PlantUmlCodeGenerator.formatText(p.name, this.options.methodParameterName) +
                            ": " +
                            PlantUmlCodeGenerator.formatText(
                                p.type
                                    ? PlantUmlCodeGenerator.getTypeNameWithReplacedTypeParameters(
                                          p.type,
                                          localTypeParamsMap,
                                      )
                                    : "unknown",
                                this.options.methodParameterType,
                            ),
                    )
                    .join(", ");
            }
        }

        plantUml += ")";

        // Return type
        plantUml +=
            " : " +
            PlantUmlCodeGenerator.formatText(
                signature.type
                    ? PlantUmlCodeGenerator.getTypeNameWithReplacedTypeParameters(signature.type, localTypeParamsMap)
                    : "void",
                this.options.methodReturnType,
            );

        return plantUml;
    }

    /**
     * Returns the PlantUML line for generating the output for a given property.
     * @param property The property for which the PlantUML should be generated.
     * @param typeParamsMap If the property belongs to a class which has type arguments this map contains the mapping of
     *                      the type parameters to their type arguments.
     * @returns The PlantUML line for the given property.
     */
    private createPlantUmlForProperty(
        property: Readonly<DeclarationReflection>,
        typeParamsMap: ReadonlyMap<string, string>,
    ): string {
        let plantUml = "    "; // indent

        if (property.flags.isStatic) {
            plantUml += "{static} ";
        }

        if (property.flags.isPrivate) {
            plantUml += "-";
        } else if (property.flags.isProtected) {
            plantUml += "#";
        } else {
            plantUml += "+"; // default is public for JS/TS
        }

        const propertyName = PlantUmlCodeGenerator.formatText(property.name, this.options.propertyName);
        const propertyType = PlantUmlCodeGenerator.formatText(
            property.type
                ? PlantUmlCodeGenerator.getTypeNameWithReplacedTypeParameters(property.type, typeParamsMap)
                : "unknown",
            this.options.propertyType,
        );

        plantUml += propertyName + " : " + propertyType;

        return plantUml;
    }

    /**
     * Creates a map which includes the type argument names for every type parameter name.
     * @param typeParameters The type parameters.
     * @param typeArguments The possible type arguments.
     * @returns A map which includes the type argument names for every type parameter name.
     */
    protected static createTypeParameterMapping(
        typeParameters: ReadonlyArray<TypeParameterReflection>,
        typeArguments?: ReadonlyArray<Type>,
    ): Map<string, string> {
        const typeParamsMap = new Map<string, string>();

        for (let i = 0; i < typeParameters.length; ++i) {
            const typeArgument = typeArguments && typeArguments[i] ? typeArguments[i] : typeParameters[i].default;

            if (typeArgument) {
                const typeArgumentName = typeParameters[i].name;
                const typeArgumentValue = typeArgument.toString();

                typeParamsMap.set(typeArgumentName, typeArgumentValue);
            }
        }

        return typeParamsMap;
    }

    /**
     * Escapes the name by putting double quotes around it preventing a PlantUML syntax error.
     * @param name The original name.
     * @returns The escaped name.
     */
    private static escapeName(name: string): string {
        return '"' + name + '"';
    }

    /**
     * Returns the name of a type. If the type includes template parameters those are replaced with their values
     * using the second argument (typeParamsMap).
     * @param type The type whos name is wanted.
     * @param typeParamsMap Possible template parameter values.
     * @returns The name of the type.
     */
    private static getTypeNameWithReplacedTypeParameters(
        type: Readonly<Type>,
        typeParamsMap: ReadonlyMap<string, string>,
    ): string {
        let name = type.toString();

        // Replace type parameters with their arguments
        for (const [key, value] of typeParamsMap.entries()) {
            const regex = new RegExp("(?<![\\w])" + key + "(?![\\w])", "g"); // negative look-behind & look-ahead
            name = name.replace(regex, value);
        }

        return name;
    }

    /**
     * Returns the full name of a given reflection. If the reflection is a template class and therefore has type
     * parameters, these are included in the name as <A, B, C>. If the reflection is based on a template class and
     * therefore has type arguments, these are included in the name as <string, number, any>.
     * @param reflection The reflection whos full name is wanted.
     * @param typeParamsMap If the property belongs to a class which has type arguments this map contains the mapping of
     *                      the type parameters to their type arguments.
     * @returns The full name of the reflection.
     */
    private static getFullReflectionName(
        reflection: Readonly<DeclarationReflection>,
        typeParamsMap?: ReadonlyMap<string, string>,
    ): string {
        let name = reflection.name;

        if (reflection.typeParameters && reflection.typeParameters.length > 0) {
            name += "<";
            name += typeParamsMap?.size
                ? Array.from(typeParamsMap.values()).join(", ")
                : reflection.typeParameters.map((t: Readonly<TypeParameterReflection>) => t.name).join(", ");
            name += ">";
        }

        return name;
    }

    /**
     * Returns the PlantUML line for the introduction of a class or interface.
     * @param reflection The class or interface for which the PlantUML should be generated.
     * @param typeParamsMap If the property belongs to a class which has type arguments this map contains the mapping of
     *                      the type parameters to their type arguments.
     * @returns The PlantUML line for the given class or interface.
     */
    private static createPlantUmlForClassOrInterface(
        reflection: Readonly<DeclarationReflection>,
        typeParamsMap: ReadonlyMap<string, string>,
    ): string {
        let plantUml = "";

        if (reflection.flags.isStatic) {
            plantUml += "static ";
        }

        if (reflection.flags.isAbstract) {
            plantUml += "abstract ";
        }

        plantUml += reflection.kind === ReflectionKind.Class ? "class " : "interface ";

        const name = PlantUmlCodeGenerator.getFullReflectionName(reflection, typeParamsMap);
        plantUml += PlantUmlCodeGenerator.escapeName(name);

        return plantUml;
    }

    /**
     * Returns the full name of a given type. If the type has a reflection, the full name of that reflection is
     * returned. If the type is based on a template class and therefore has type arguments, these are included
     * in the name as <D, E, F>.
     * @param type The type whos full name is wanted.
     * @returns The full name of the type.
     */
    private static getFullTypeName(type: Readonly<ReferenceType>): string {
        if (type.reflection instanceof DeclarationReflection) {
            const typeParamsMap = type.reflection.typeParameters
                ? PlantUmlCodeGenerator.createTypeParameterMapping(type.reflection.typeParameters, type.typeArguments)
                : new Map<string, string>();
            return PlantUmlCodeGenerator.getFullReflectionName(type.reflection, typeParamsMap);
        } else if (type.typeArguments && type.typeArguments.length > 0) {
            let name = type.name + "<";
            name += type.typeArguments.map((t: Readonly<Type>) => t.toString()).join(", ");
            name += ">";
            return name;
        }

        return type.toString();
    }

    /**
     * Creates dummy PlantUML lines for the given type.
     * @param type The type for which the PlantUML lines are generated.
     * @returns The PlantUML lines for the given type.
     */
    private static createDummyPlantUmlForType(type: Readonly<ReferenceType>): string[] {
        const name = PlantUmlCodeGenerator.getFullTypeName(type);
        const escapedName = PlantUmlCodeGenerator.escapeName(name);

        const code = new Array<string>();

        code.push("class " + escapedName);
        code.push("hide " + escapedName + " circle"); // hide the circle, because we don't know if it is really a class

        return code;
    }

    /**
     * Adds legacy HTML to the given text to format it according to the given style.
     * @param text The text that should be formatted.
     * @param style The style that should be used when formating the text.
     * @returns The text extended with legacy HTML to format it.
     */
    private static formatText(text: string, style: TextStyle): string {
        let result = "";

        if (style.backgroundColor) {
            result += `<back:${style.backgroundColor}>`;
        }
        if (style.color) {
            result += `<color:${style.color}>`;
        }
        if (style.font.family) {
            result += `<font:"${style.font.family}">`;
        }
        if (style.font.size > 0) {
            result += `<size:${style.font.size}>`;
        }
        if (style.font.bold) {
            result += "<b>";
        }
        if (style.font.italic) {
            result += "<i>";
        }
        if (style.font.underline) {
            result += "<u>";
        }
        if (style.font.strikeout) {
            result += "<s>";
        }

        result += text;

        if (style.font.strikeout) {
            result += "</s>";
        }
        if (style.font.underline) {
            result += "</u>";
        }
        if (style.font.italic) {
            result += "</i>";
        }
        if (style.font.bold) {
            result += "</b>";
        }
        if (style.font.size > 0) {
            result += "</size>";
        }
        if (style.font.family) {
            result += "</font>";
        }
        if (style.color) {
            result += "</color>";
        }
        if (style.backgroundColor) {
            result += "</back>";
        }

        return result;
    }
}
