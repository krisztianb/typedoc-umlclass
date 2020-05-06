import * as pako from "pako";
import {
    DeclarationReflection,
    IntrinsicType,
    ReferenceType,
    ReflectionKind,
    TypeParameterType,
    UnknownType,
} from "typedoc/dist/lib/models/index";

/**
 * Class with utility functions regarding PlantUML code.
 */
export class PlantUmlUtils {
    /** URL to the PlantUML web page, where one can generate UML diagrams. */
    public static readonly plantUmlServerUrl = "http://www.plantuml.com/plantuml/";

    /**
     * Returns an array of PlantUML lines for generating the box (including its properties and methods) of a given type.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeChildren Specifies whether the resulting PlantUML should include the properties and methods of
     *                        the given reflection as well.
     * @returns The PlantUML lines for the given type.
     */
    public static createPlantUmlForReflection(reflection: DeclarationReflection, includeChildren: boolean): string[] {
        const plantUmlLines = new Array<string>();

        if (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) {
            plantUmlLines.push(PlantUmlUtils.createPlantUmlForClassOrInterface(reflection) + " {");

            if (includeChildren && reflection.children) {
                for (const children of reflection.children) {
                    if (children.kind === ReflectionKind.Property) {
                        plantUmlLines.push(PlantUmlUtils.createPlantUmlForProperty(children));
                    } else if (children.kind === ReflectionKind.Method) {
                        plantUmlLines.push(PlantUmlUtils.createPlantUmlForMethod(children));
                    }
                }
            }

            plantUmlLines.push("}");
        }

        return plantUmlLines;
    }

    /**
     * Encodes the given string to a nearly base64 format.
     * @param text The string to encode.
     * @returns The encoded string.
     */
    public static encode(text: string): string {
        return PlantUmlUtils.encode64(pako.deflate(text, { level: 9, to: "string" })) as string;
    }

    /**
     * Returns the URL for a given diagram data.
     * @param data The data of the diagram.
     * @param imageFormat The format of the image the URL should generate. (eg.: "png" or "svg")
     * @returns The URL for a given diagram data.
     */
    public static createPlantUmlServerUrl(data: string, imageFormat: string): string {
        return PlantUmlUtils.plantUmlServerUrl + imageFormat + "/~1" + data;
    }

    /**
     * Returns the PlantUML line for generating the output for a given property.
     * @param property The property for which the PlantUML should be generated.
     * @returns The PlantUML line for the given property.
     */
    protected static createPlantUmlForProperty(property: DeclarationReflection): string {
        let plantUml = "";

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

        plantUml += property.name;

        if (
            property.type instanceof IntrinsicType ||
            property.type instanceof ReferenceType ||
            property.type instanceof TypeParameterType ||
            property.type instanceof UnknownType
        ) {
            plantUml += " : " + property.type.name;
        }

        return plantUml;
    }

    /**
     * Returns the PlantUML line for generating the output for a given method.
     * @param methode The method for which the PlantUML should be generated.
     * @returns The PlantUML line for the given method.
     */
    protected static createPlantUmlForMethod(method: DeclarationReflection): string {
        let plantUml = "";

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

        plantUml += method.name + "()";

        if (method.type) {
            if (
                method.type instanceof IntrinsicType ||
                method.type instanceof ReferenceType ||
                method.type instanceof TypeParameterType ||
                method.type instanceof UnknownType
            ) {
                plantUml += " : " + method.type.name;
            }
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
    protected static createPlantUmlForClassOrInterface(reflection: DeclarationReflection): string {
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

    /**
     * Returns a 6-bit encoded version of the given byte.
     * @param b The byte to encode.
     * @returns The encoded byte.
     */
    protected static encode6bit(b: number): string {
        if (b < 10) {
            return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
            return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
            return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b === 0) {
            return "-";
        }
        if (b === 1) {
            return "_";
        }
        return "?";
    }

    /**
     * Appends 3 bytes using a 6-bit encoding.
     * @param b1 Byte one.
     * @param b2 Byte two.
     * @param b3 Byte three.
     * @returns The appended three bytes with a 6-bit encoding.
     */
    protected static append3bytes(b1: number, b2: number, b3: number): string {
        const c1 = b1 >> 2;
        const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
        const c4 = b3 & 0x3f;
        let r = "";
        r += PlantUmlUtils.encode6bit(c1 & 0x3f);
        r += PlantUmlUtils.encode6bit(c2 & 0x3f);
        r += PlantUmlUtils.encode6bit(c3 & 0x3f);
        r += PlantUmlUtils.encode6bit(c4 & 0x3f);
        return r;
    }

    /**
     * Returns a 64-bit encoding of a given data string.
     * @param data The data string to encode.
     * @returns The 64-bit encoded version of the data string.
     * @remarks Code taken from: http://plantuml.sourceforge.net/codejavascript2.html
     *          It is described as being "a transformation close to base64".
     *          The code has been slightly modified to pass linters.
     */
    protected static encode64(data: string): string {
        let r = "";
        for (let i = 0; i < data.length; i += 3) {
            if (i + 2 === data.length) {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
            } else if (i + 1 === data.length) {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), 0, 0);
            } else {
                r += PlantUmlUtils.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
            }
        }
        return r;
    }
}
