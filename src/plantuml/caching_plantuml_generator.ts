import { DeclarationReflection } from "typedoc";
import { PlantUmlGenerator } from "./plantuml_generator";

/**
 * Class that generates PlantUML code and caches results internally.
 */
export class CachingPlantUmlGenerator extends PlantUmlGenerator {
    /**
     * Caches the PlantUML generated for the reflections (= class or interface).
     * KEY = ID of the reflection
     * VALUE = PlantUML lines
     */
    private reflectionPlantUmlCache = new Map<number, string[]>();

    /**
     * Creates an array of PlantUML lines for generating the box (including its properties and methods) of a given type.
     * Caches the result so that another call with the same reflection will be faster.
     * @param reflection The reflection for which the PlantUML should be generated.
     * @param includeMembers Specifies whether the resulting PlantUML should include the properties and methods of
     *                       the given reflection as well.
     * @returns The PlantUML lines for the given type.
     */
    protected createPlantUmlForReflection(reflection: DeclarationReflection, includeMembers: boolean): string[] {
        if (!this.reflectionPlantUmlCache.has(reflection.id)) {
            this.reflectionPlantUmlCache.set(
                reflection.id,
                super.createPlantUmlForReflection(reflection, includeMembers)
            );
        }

        return this.reflectionPlantUmlCache.get(reflection.id) as string[];
    }
}
