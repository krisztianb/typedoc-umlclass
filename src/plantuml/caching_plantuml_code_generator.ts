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
     * @param typeArguments If the reflection is the binding of a template class, this array contains the type arguments
     *                      for the template class parameters.
     * @param isType Specifies whether the reflection belongs to a type. This parameter is necessary to distinguish
     *               between a template class and a type based on the template class, because missing typeArguments
     *               can either mean that the default types for all type parameters are used for the type or that the
     *               reflection stands for a template class.
     * @returns The PlantUML lines for the reflection.
     */
    protected createPlantUmlForReflection(
        reflection: DeclarationReflection,
        typeArguments?: Type[],
        isType: boolean = false,
    ): string[] {
        // Build cache-key
        let cacheKey = String(reflection.id);

        const typeParamsMap =
            reflection.typeParameters && isType
                ? super.createTypeParameterMapping(reflection.typeParameters, typeArguments)
                : new Map<string, string>();

        if (reflection.typeParameters) {
            if (typeParamsMap.size > 0) {
                cacheKey += "<" + Array.from(typeParamsMap.values()).join(", ") + ">";
            } else {
                cacheKey += "<" + reflection.typeParameters.map((t) => t.name).join(", ") + ">";
            }
        }

        // Cache reflection
        if (!this.reflectionPlantUmlCache.has(cacheKey)) {
            this.reflectionPlantUmlCache.set(
                cacheKey,
                super.createPlantUmlForReflection(reflection, typeArguments, isType),
            );
        }

        return this.reflectionPlantUmlCache.get(cacheKey) as string[];
    }
}
