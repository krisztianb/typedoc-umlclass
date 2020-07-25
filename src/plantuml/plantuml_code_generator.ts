import {
    DeclarationReflection,
    ReferenceType,
    ReflectionFlags,
    ReflectionKind,
    SignatureReflection,
    Type,
    TypeParameterReflection,
} from "typedoc/dist/lib/models/index";
import {
    ClassDiagramMemberVisibilityStyle,
    ClassDiagramType,
    FontStyle,
    MemberOrder,
    MethodParameterOutput,
} from "../enumerations";
import {
    nameAbc,
    privateToPublic,
    publicToPrivate,
    TypeDocMemberCompareFunction,
} from "../typedoc/typedoc_member_sorter";
import { TypeDocUtils } from "../typedoc/typedoc_utils";
import { PlantUmlCodeGeneratorOptions } from "./plantuml_code_generator_options";

/**
 * Class that generates PlantUML code.
 */
export class PlantUmlCodeGenerator {
    /** The options for the PlantUML output. */
    private options: PlantUmlCodeGeneratorOptions;

    /** Compare function used for sorting class members. */
    private classMemberCompareFunction: TypeDocMemberCompareFunction;

    /**
     * Creates a new PlantUmlGenerator object with the given options.
     * @param options The options for the PlantUML output.
     */
    constructor(options: PlantUmlCodeGeneratorOptions) {
        this.options = options;

        if (this.options.classDiagramMemberOrder === MemberOrder.PublicToPrivate) {
            this.classMemberCompareFunction = publicToPrivate;
        } else if (this.options.classDiagramMemberOrder === MemberOrder.PrivateToPublic) {
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
    public createClassDiagramPlantUmlForReflection(reflection: DeclarationReflection): string[] {
        const includeMembers = this.options.classDiagramType === ClassDiagramType.Detailed;

        let plantUmlLines = new Array<string>();
        let siblingsAbove = 0;
        let siblingsBelow = 0;

        // add class/interface
        const reflectionName = this.getFullReflectionName(reflection);
        plantUmlLines = plantUmlLines.concat(this.createPlantUmlForReflection(reflection, includeMembers));

        // add classes/interfaces this type is extending
        const extendedTypes = TypeDocUtils.getExtendedTypesForReflection(reflection);

        for (const extendedType of extendedTypes) {
            const extendedTypeName = this.getFullTypeName(extendedType);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedType, includeMembers));
            plantUmlLines.push(this.escapeName(extendedTypeName) + " <|-- " + this.escapeName(reflectionName));

            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        const implementedTypes = TypeDocUtils.getImplementedTypesForReflection(reflection);

        for (const implementedType of implementedTypes) {
            const implementedTypeName = this.getFullTypeName(implementedType);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedType, includeMembers));
            plantUmlLines.push(this.escapeName(implementedTypeName) + " <|.. " + this.escapeName(reflectionName));

            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        const extendedBys = TypeDocUtils.getExtendedBysForReflection(reflection);

        for (const extendedBy of extendedBys) {
            const extendedByName = this.getFullTypeName(extendedBy);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedBy, includeMembers));
            plantUmlLines.push(this.escapeName(reflectionName) + " <|-- " + this.escapeName(extendedByName));

            ++siblingsBelow;
        }

        // add classes that are implementing this type
        const implementedBys = TypeDocUtils.getImplementedBysForReflection(reflection);

        for (const implementedBy of implementedBys) {
            const implementedByName = this.getFullTypeName(implementedBy);

            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedBy, includeMembers));
            plantUmlLines.push(this.escapeName(reflectionName) + " <|.. " + this.escapeName(implementedByName));

            ++siblingsBelow;
        }

        if (this.options.classDiagramHideEmptyMembers) {
            plantUmlLines.unshift("hide empty fields");
            plantUmlLines.unshift("hide empty methods");
        }

        if (this.options.classDiagramHideCircledChar) {
            plantUmlLines.unshift("hide circle");
        }

        if (
            siblingsAbove > this.options.classDiagramTopDownLayoutMaxSiblings ||
            siblingsBelow > this.options.classDiagramTopDownLayoutMaxSiblings
        ) {
            plantUmlLines.unshift("left to right direction");
        }

        if (this.options.classDiagramMemberVisibilityStyle === ClassDiagramMemberVisibilityStyle.Text) {
            plantUmlLines.unshift("skinparam ClassAttributeIconSize 0");
        }

        if (this.options.classDiagramHideShadow) {
            plantUmlLines.unshift("skinparam Shadowing false");
        }

        if (this.options.classDiagramBoxBorderRadius) {
            plantUmlLines.unshift("skinparam RoundCorner " + this.options.classDiagramBoxBorderRadius);
        }

        if (this.options.classDiagramBoxBackgroundColor) {
            plantUmlLines.unshift("skinparam ClassBackgroundColor " + this.options.classDiagramBoxBackgroundColor);
        }

        if (this.options.classDiagramBoxBorderColor) {
            plantUmlLines.unshift("skinparam ClassBorderColor " + this.options.classDiagramBoxBorderColor);
        }

        if (this.options.classDiagramBoxBorderWidth >= 0) {
            plantUmlLines.unshift("skinparam ClassBorderThickness " + this.options.classDiagramBoxBorderWidth);
        }

        if (this.options.classDiagramArrowColor) {
            plantUmlLines.unshift("skinparam ClassArrowColor " + this.options.classDiagramArrowColor);
        }

        if (this.options.classDiagramClassFontName) {
            plantUmlLines.unshift("skinparam ClassFontName " + this.options.classDiagramClassFontName);
        }

        if (this.options.classDiagramClassFontSize) {
            plantUmlLines.unshift("skinparam ClassFontSize " + this.options.classDiagramClassFontSize);
        }

        if (this.options.classDiagramClassFontStyle !== FontStyle.Undefined) {
            plantUmlLines.unshift("skinparam ClassFontStyle " + this.options.classDiagramClassFontStyle.toString());
        }

        if (this.options.classDiagramClassFontColor) {
            plantUmlLines.unshift("skinparam ClassFontColor " + this.options.classDiagramClassFontColor);
        }

        if (this.options.classDiagramClassAttributeFontName) {
            plantUmlLines.unshift(
                "skinparam ClassAttributeFontName " + this.options.classDiagramClassAttributeFontName
            );
        }

        if (this.options.classDiagramClassAttributeFontSize) {
            plantUmlLines.unshift(
                "skinparam ClassAttributeFontSize " + this.options.classDiagramClassAttributeFontSize
            );
        }

        if (this.options.classDiagramClassAttributeFontStyle !== FontStyle.Undefined) {
            plantUmlLines.unshift(
                "skinparam ClassAttributeFontStyle " + this.options.classDiagramClassAttributeFontStyle.toString()
            );
        }

        if (this.options.classDiagramClassAttributeFontColor) {
            plantUmlLines.unshift(
                "skinparam ClassAttributeFontColor " + this.options.classDiagramClassAttributeFontColor
            );
        }

        return ["@startuml", ...plantUmlLines, "@enduml"];
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a type.
     * @param type The type for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the type as well.
     * @returns The PlantUML lines for the type.
     */
    private createPlantUmlForType(type: ReferenceType, includeMembers: boolean): string[] {
        const reflection = type.reflection;

        if (
            reflection &&
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface)
        ) {
            return this.createPlantUmlForReflection(reflection, includeMembers, type.typeArguments);
        } else {
            return this.createDummyPlantUmlForType(type);
        }
    }

    /**
     * Creates dummy PlantUML lines for the given type.
     * @param type The type for which the PlantUML lines are generated.
     * @returns The PlantUML lines for the given type.
     */
    private createDummyPlantUmlForType(type: ReferenceType): string[] {
        const name = this.getFullTypeName(type);
        const escapedName = this.escapeName(name);

        const code = new Array<string>();

        code.push("class " + escapedName);
        code.push("hide " + escapedName + " circle"); // hide the circle, because we don't know if it is really a class

        return code;
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a reflection.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the reflection as well.
     * @param typeArguments Possible type arguments if the reflection is based on a template class.
     * @returns The PlantUML lines for the reflection.
     */
    protected createPlantUmlForReflection(
        reflection: DeclarationReflection,
        includeMembers: boolean,
        typeArguments?: Type[]
    ): string[] {
        // Build type parameter map used in the methods below
        const typeParamsMap =
            reflection.typeParameters && typeArguments
                ? this.createTypeParameterMapping(reflection.typeParameters, typeArguments)
                : new Map<string, string>();

        // Build PlantUML code
        const plantUmlLines = new Array<string>();

        plantUmlLines.push(this.createPlantUmlForClassOrInterface(reflection, typeArguments) + " {");

        if (includeMembers && reflection.children) {
            // Process properties
            const props = reflection.children
                .filter((c) => c.kind === ReflectionKind.Property)
                .sort(this.classMemberCompareFunction);

            for (const prop of props) {
                plantUmlLines.push(this.createPlantUmlForProperty(prop, typeParamsMap));
            }

            // Process method signatures
            const methods = reflection.children
                .filter((c) => c.kind === ReflectionKind.Method)
                .sort(this.classMemberCompareFunction);

            for (const method of methods) {
                if (method.signatures) {
                    for (const signature of method.signatures) {
                        plantUmlLines.push(
                            this.createPlantUmlForMethodSignature(method.flags, signature, typeParamsMap)
                        );
                    }
                }
            }
        }

        plantUmlLines.push("}");

        return plantUmlLines;
    }

    /**
     * Returns the PlantUML line for the introduction of a class or interface.
     * @param reflection The class or interface for which the PlantUML should be generated.
     * @param typeArguments Possible type arguments if the reflection is based on a template class.
     * @returns The PlantUML line for the given class or interface.
     */
    private createPlantUmlForClassOrInterface(reflection: DeclarationReflection, typeArguments?: Type[]): string {
        let plantUml = "";

        if (reflection.flags.isStatic) {
            plantUml += "static ";
        }

        if (reflection.flags.isAbstract) {
            plantUml += "abstract ";
        }

        if (reflection.kind === ReflectionKind.Class) {
            plantUml += "class ";
        } else {
            plantUml += "interface ";
        }

        const name = this.getFullReflectionName(reflection, typeArguments);
        plantUml += this.escapeName(name);

        return plantUml;
    }

    /**
     * Returns the PlantUML line for generating the output for a given property.
     * @param property The property for which the PlantUML should be generated.
     * @param typeParamsMap If the property belongs to a class which has type arguments this map contains the mapping of
     *                      the type parameters to their type arguments.
     * @returns The PlantUML line for the given property.
     */
    private createPlantUmlForProperty(property: DeclarationReflection, typeParamsMap: Map<string, string>): string {
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

        plantUml +=
            property.name +
            " : " +
            (property.type ? this.getTypeNameWithReplacedTypeParameters(property.type, typeParamsMap) : "unknown");

        return plantUml;
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
        methodFlags: ReflectionFlags,
        signature: SignatureReflection,
        typeParamsMap: Map<string, string>
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

        plantUml += signature.name;

        // Type-parameters
        if (signature.typeParameters) {
            plantUml += "<";
            plantUml += signature.typeParameters.map((p) => p.name).join(", ");
            plantUml += ">";

            // Remove type parameters of signature from type parameter/argument mapping of class
            typeParamsMap = new Map(typeParamsMap);

            signature.typeParameters.forEach((p) => {
                typeParamsMap.delete(p.name);
            });
        }

        // Arguments
        plantUml += "(";

        if (signature.parameters) {
            if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.OnlyNames) {
                plantUml += signature.parameters.map((p) => p.name).join(", ");
            } else if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.OnlyTypes) {
                plantUml += signature.parameters
                    .map((p) =>
                        p.type ? this.getTypeNameWithReplacedTypeParameters(p.type, typeParamsMap) : "unknown"
                    )
                    .join(", ");
            } else if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.Complete) {
                plantUml += signature.parameters
                    .map(
                        (p) =>
                            p.name +
                            ": " +
                            (p.type ? this.getTypeNameWithReplacedTypeParameters(p.type, typeParamsMap) : "unknown")
                    )
                    .join(", ");
            }
        }

        plantUml += ")";

        // Return type
        if (signature.type) {
            plantUml += " : " + this.getTypeNameWithReplacedTypeParameters(signature.type, typeParamsMap);
        } else {
            plantUml += " : void";
        }

        return plantUml;
    }

    /**
     * Escapes the name by putting double quotes around it preventing a PlantUML syntax error.
     * @param name The original name.
     * @returns The escaped name.
     */
    private escapeName(name: string): string {
        return '"' + name + '"';
    }

    /**
     * Creates a map which includes the type argument names for every type parameter name.
     * @param typeParameters The type parameters.
     * @param typeArguments The type arguments.
     * @returns A map which includes the type argument names for every type parameter name.
     */
    private createTypeParameterMapping(
        typeParameters: TypeParameterReflection[],
        typeArguments: Type[]
    ): Map<string, string> {
        const typeParamsMap = new Map<string, string>();

        for (let i = 0; i < typeParameters.length; ++i) {
            const typeArgumentName = typeParameters[i].name;
            const typeArgumentValue = typeArguments[i].toString();
            typeParamsMap.set(typeArgumentName, typeArgumentValue);
        }

        return typeParamsMap;
    }

    /**
     * Returns the name of a type. If the type includes template parameters those are replaced with their values
     * using the second argument (typeParamsMap).
     * @param type The type whos name is wanted.
     * @param typeParamsMap Possible template parameter values.
     * @returns The name of the type.
     */
    private getTypeNameWithReplacedTypeParameters(type: Type, typeParamsMap: Map<string, string>): string {
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
     * therefore has type arguments, these are included in the name as <D, E, F>.
     * @param reflection The reflection whos full name is wanted.
     * @param typeArguments Possible type arguments.
     * @returns The full name of the reflection.
     */
    private getFullReflectionName(reflection: DeclarationReflection, typeArguments?: Type[]): string {
        let name = reflection.name;

        if (reflection.typeParameters) {
            name += "<";
            if (typeArguments) {
                name += typeArguments.map((t) => t.toString()).join(", ");
            } else {
                name += reflection.typeParameters.map((t) => t.name).join(", ");
            }
            name += ">";
        }

        return name;
    }

    /**
     * Returns the full name of a given type. If the type has a reflection, the full name of that reflection is
     * returned. If the type is based on a template class and therefore has type arguments, these are included
     * in the name as <D, E, F>.
     * @param type The type whos full name is wanted.
     * @returns The full name of the type.
     */
    private getFullTypeName(type: ReferenceType): string {
        if (type.reflection instanceof DeclarationReflection) {
            return this.getFullReflectionName(type.reflection, type.typeArguments);
        } else if (type.typeArguments) {
            let name = type.name + "<";
            name += type.typeArguments.map((t) => t.toString()).join(", ");
            name += ">";
            return name;
        } else {
            return type.toString();
        }
    }
}
