import { DeclarationReflection } from "typedoc";
import { Type } from "typedoc/dist/lib/models";
import { PlantUmlCodeGenerator } from "./plantuml_code_generator";

/**
 * Class that generates PlantUML code and caches results internally.
 */
export class CachingPlantUmlCodeGenerator extends PlantUmlCodeGenerator {
    /**
     * Caches the PlantUML generated for the reflections (= class or interface).
     * KEY = ID of the reflection (and possible type arguments)
     * VALUE = PlantUML lines
     */
    private reflectionPlantUmlCache = new Map<string, string[]>();

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a reflection.
     * Caches the result so that another call with the same parameters will be faster.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the reflection as well.
     * @param typeArguments If the reflection is the binding of a template class, this array contains the type arguments
     *                      for the template class parameters.
     * @returns The PlantUML lines for the reflection.
     */
    protected createPlantUmlForReflection(
        reflection: DeclarationReflection,
        includeMembers: boolean,
        typeArguments?: Type[],
    ): string[] {
        // Build cache-key
        let cacheKey = String(reflection.id);

        if (reflection.typeParameters) {
            if (typeArguments) {
                cacheKey += "<" + typeArguments.map((t) => t.toString()).join(", ") + ">";
            } else {
                cacheKey += "<" + reflection.typeParameters.map((t) => t.name).join(", ") + ">";
            }
        }

        // Cache reflection
        if (!this.reflectionPlantUmlCache.has(cacheKey)) {
            this.reflectionPlantUmlCache.set(
                cacheKey,
                super.createPlantUmlForReflection(reflection, includeMembers, typeArguments),
            );
        }

        return this.reflectionPlantUmlCache.get(cacheKey) as string[];
    }
}
