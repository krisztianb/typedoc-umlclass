import * as pako from "pako";

/**
 * Class with utility functions regarding PlantUML code.
 */
export class PlantUmlUtils {
    /** URL to the PlantUML web page, where one can generate UML diagrams. */
    public static readonly plantUmlServerUrl = "http://www.plantuml.com/plantuml/";

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
