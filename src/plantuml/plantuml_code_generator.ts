import {
    DeclarationReflection,
    ReferenceType,
    ReflectionKind,
    SignatureReflection,
} from "typedoc/dist/lib/models/index";
import { ClassDiagramMemberVisibilityStyle, ClassDiagramType, FontStyle, MethodParameterOutput } from "../enumerations";
import { TypeDocUtils } from "../typedoc/typedoc_utils";
import { PlantUmlCodeGeneratorOptions } from "./plantuml_code_generator_options";

/**
 * Class that generates PlantUML code.
 */
export class PlantUmlCodeGenerator {
    /** The options for the PlantUML output. */
    private options: PlantUmlCodeGeneratorOptions;

    /**
     * Creates a new PlantUmlGenerator object with the given options.
     * @param options The options for the PlantUML output.
     */
    constructor(options: PlantUmlCodeGeneratorOptions) {
        this.options = options;
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
        plantUmlLines = plantUmlLines.concat(this.createPlantUmlForReflection(reflection, includeMembers));

        // add classes/interfaces this type is extending
        const extendedTypes = TypeDocUtils.getExtendedTypesForReflection(reflection);

        for (const extendedType of extendedTypes) {
            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedType, includeMembers));
            plantUmlLines.push(extendedType.name + " <|-- " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        const implementedTypes = TypeDocUtils.getImplementedTypesForReflection(reflection);

        for (const implementedType of implementedTypes) {
            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedType, includeMembers));
            plantUmlLines.push(implementedType.name + " <|.. " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        const extendedBys = TypeDocUtils.getExtendedBysForReflection(reflection);

        for (const extendedBy of extendedBys) {
            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(extendedBy, includeMembers));
            plantUmlLines.push(reflection.name + " <|-- " + extendedBy.name);
            ++siblingsBelow;
        }

        // add classes that are implementing this type
        const implementedBys = TypeDocUtils.getImplementedBysForReflection(reflection);

        for (const implementedBy of implementedBys) {
            plantUmlLines = plantUmlLines.concat(this.createPlantUmlForType(implementedBy, includeMembers));
            plantUmlLines.push(reflection.name + " <|.. " + implementedBy.name);
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

        return plantUmlLines;
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a reflection.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the reflection as well.
     * @returns The PlantUML lines for the reflection.
     */
    protected createPlantUmlForReflection(reflection: DeclarationReflection, includeMembers: boolean): string[] {
        const plantUmlLines = new Array<string>();

        if (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) {
            plantUmlLines.push(this.createPlantUmlForClassOrInterface(reflection) + " {");

            if (includeMembers && reflection.children) {
                for (const children of reflection.children) {
                    if (children.kind === ReflectionKind.Property) {
                        plantUmlLines.push(this.createPlantUmlForProperty(children));
                    } else if (children.kind === ReflectionKind.Method && children.signatures) {
                        for (const signature of children.signatures) {
                            plantUmlLines.push(this.createPlantUmlForMethod(signature));
                        }
                    }
                }
            }

            plantUmlLines.push("}");
        }

        return plantUmlLines;
    }

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a type.
     * @param type The type for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the type as well.
     * @returns The PlantUML lines for the type.
     */
    protected createPlantUmlForType(type: ReferenceType, includeMembers: boolean): string[] {
        const reflection = type.reflection;

        if (!reflection) {
            // create a dummy definition: if you delete the comment older PlantUML versions raise a syntax error
            return ["class " + type.name + " {", "' reflection not available", "}"];
        } else if (reflection instanceof DeclarationReflection) {
            return this.createPlantUmlForReflection(reflection, includeMembers);
        }

        return [];
    }

    /**
     * Returns the PlantUML line for generating the output for a given property.
     * @param property The property for which the PlantUML should be generated.
     * @returns The PlantUML line for the given property.
     */
    private createPlantUmlForProperty(property: DeclarationReflection): string {
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

        plantUml += property.name + " : " + (property.type ? property.type.toString() : "unknown");

        return plantUml;
    }

    /**
     * Returns the PlantUML line for generating the output for a given method.
     * @param methode The method for which the PlantUML should be generated.
     * @returns The PlantUML line for the given method.
     */
    private createPlantUmlForMethod(method: SignatureReflection): string {
        let plantUml = "    "; // indent

        if (method.flags.isStatic) {
            plantUml += "{static} ";
        }

        if (method.flags.isAbstract) {
            plantUml += "{abstract} ";
        }

        if (method.flags.isPrivate) {
            plantUml += "-";
        } else if (method.flags.isProtected) {
            plantUml += "#";
        } else {
            plantUml += "+"; // public is default for JS/TS
        }

        plantUml += method.name + "(";

        if (method.parameters) {
            if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.OnlyNames) {
                plantUml += method.parameters.map((p) => p.name).join(", ");
            } else if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.OnlyTypes) {
                plantUml += method.parameters.map((p) => (p.type ? p.type.toString() : "unknown")).join(", ");
            } else if (this.options.classDiagramMethodParameterOutput === MethodParameterOutput.Complete) {
                plantUml += method.parameters
                    .map((p) => p.name + ": " + (p.type ? p.type.toString() : "unknown"))
                    .join(", ");
            }
        }

        plantUml += ")";

        if (method.type) {
            plantUml += " : " + method.type.toString();
        } else {
            plantUml += " : void";
        }

        return plantUml;
    }

    /**
     * Returns the PlantUML line for the introduction of a class or interface.
     * @param reflection The class or interface for which the PlantUML should be generated.
     * @returns The PlantUML line for the given class or interface.
     */
    private createPlantUmlForClassOrInterface(reflection: DeclarationReflection): string {
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

        plantUml += reflection.name;

        return plantUml;
    }
}
