import { DeclarationReflection, ReferenceType } from "typedoc/dist/lib/models/index";

/**
 * Class with utility functions regarding TypeDoc reflections.
 */
export class TypeDocUtils {
    /**
     * Returns the reflections the given reflection is extending.
     * @param reflection The reflection whoes extended types are wanted.
     * @returns The reflections the given reflection is extending.
     */
    public static getExtendedTypesForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        const extendedTypes = new Array<DeclarationReflection>();

        if (reflection.extendedTypes) {
            for (const extendedType of reflection.extendedTypes) {
                if (extendedType instanceof ReferenceType && extendedType.reflection instanceof DeclarationReflection) {
                    extendedTypes.push(extendedType.reflection);
                }
            }
        }

        return extendedTypes;
    }

    /**
     * Returns the reflections that are extending the given reflection.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The reflections that are extending the given reflection.
     */
    public static getExtendedBysForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        const extendedBys = new Array<DeclarationReflection>();

        if (reflection.extendedBy) {
            for (const extendedByType of reflection.extendedBy) {
                if (
                    extendedByType instanceof ReferenceType &&
                    extendedByType.reflection instanceof DeclarationReflection
                ) {
                    extendedBys.push(extendedByType.reflection);
                }
            }
        }

        return extendedBys;
    }

    /**
     * Returns the reflections the given reflection is implementing.
     * @param reflection The reflection whoes implemented types are wanted.
     * @returns The reflections the given reflection is implementing.
     */
    public static getImplementedTypesForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        const implementedTypes = new Array<DeclarationReflection>();

        if (reflection.implementedTypes) {
            // build a list of all implemented types of the reflection
            // note: this list also includes all implemented types that base classes are implementing
            for (const implementedType of reflection.implementedTypes) {
                if (
                    implementedType instanceof ReferenceType &&
                    implementedType.reflection instanceof DeclarationReflection
                ) {
                    implementedTypes.push(implementedType.reflection);
                }
            }

            if (reflection.extendedTypes) {
                let extendedTypeParents = new Array<DeclarationReflection>();

                // build a list of all parent types of the extended types
                for (const extendedType of reflection.extendedTypes) {
                    if (
                        extendedType instanceof ReferenceType &&
                        extendedType.reflection instanceof DeclarationReflection
                    ) {
                        extendedTypeParents = extendedTypeParents.concat(
                            TypeDocUtils.getParentTypesForReflection(extendedType.reflection)
                        );
                    }
                }

                // remove all implemented types that are implemented by base classes
                for (const extendedTypeParent of extendedTypeParents) {
                    for (let j = 0; j < implementedTypes.length; ++j) {
                        if (implementedTypes[j].name === extendedTypeParent.name) {
                            implementedTypes.splice(j, 1);
                            --j;
                        }
                    }
                }
            }
        }

        return implementedTypes;
    }

    /**
     * Returns the reflections that are implementing the given reflection.
     * @param reflection The reflection whoes implementations are wanted.
     * @returns The reflections that are implementing the given reflection.
     */
    public static getImplementedBysForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        const implementedBys = new Array<DeclarationReflection>();

        if (reflection.implementedBy) {
            // build a list of all implementations of the reflection
            // note: this list also includes sub classes
            for (const implementedByType of reflection.implementedBy) {
                if (
                    implementedByType instanceof ReferenceType &&
                    implementedByType.reflection instanceof DeclarationReflection
                ) {
                    implementedBys.push(implementedByType.reflection);
                }
            }

            // build a list of all sub types of the implementations
            let implementedBySubTypes = new Array<DeclarationReflection>();

            for (const implementedBy of implementedBys) {
                implementedBySubTypes = implementedBySubTypes.concat(
                    TypeDocUtils.getSubTypesForReflection(implementedBy)
                );
            }

            // remove all implementations that are sub classes of implementations
            for (const implementedBySubType of implementedBySubTypes) {
                for (let j = 0; j < implementedBys.length; ++j) {
                    if (implementedBys[j].name === implementedBySubType.name) {
                        implementedBys.splice(j, 1);
                        --j;
                    }
                }
            }
        }

        return implementedBys;
    }

    /**
     * Returns all (recursive) reflections the given reflection is extending or implementing.
     * @param reflection The reflection whoes parent types are wanted.
     * @returns The reflections the given reflection is extending or implementing.
     */
    protected static getParentTypesForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        let parentTypes = new Array<DeclarationReflection>();

        // add all extended types of the reflection
        if (reflection.extendedTypes) {
            for (const extendedType of reflection.extendedTypes) {
                if (extendedType instanceof ReferenceType && extendedType.reflection instanceof DeclarationReflection) {
                    parentTypes.push(extendedType.reflection);
                    parentTypes = parentTypes.concat(TypeDocUtils.getParentTypesForReflection(extendedType.reflection));
                }
            }
        }

        // add all implemented types of the reflection
        if (reflection.implementedTypes) {
            for (const implementedType of reflection.implementedTypes) {
                if (
                    implementedType instanceof ReferenceType &&
                    implementedType.reflection instanceof DeclarationReflection
                ) {
                    parentTypes.push(implementedType.reflection);
                    parentTypes = parentTypes.concat(
                        TypeDocUtils.getParentTypesForReflection(implementedType.reflection)
                    );
                }
            }
        }

        return TypeDocUtils.removeDuplicatesFromReflectionArray(parentTypes);
    }

    /**
     * Returns all (recursive) reflections the given reflection is extended by or implemented by.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The reflections the given reflection is extended by or implemented by.
     */
    protected static getSubTypesForReflection(reflection: DeclarationReflection): DeclarationReflection[] {
        let subTypes = new Array<DeclarationReflection>();

        // add all extensions of the reflection
        if (reflection.extendedBy) {
            for (const extendedByType of reflection.extendedBy) {
                if (
                    extendedByType instanceof ReferenceType &&
                    extendedByType.reflection instanceof DeclarationReflection
                ) {
                    subTypes.push(extendedByType.reflection);
                    subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(extendedByType.reflection));
                }
            }
        }

        // add all implementations of the reflection
        if (reflection.implementedBy) {
            for (const implementedByType of reflection.implementedBy) {
                if (
                    implementedByType instanceof ReferenceType &&
                    implementedByType.reflection instanceof DeclarationReflection
                ) {
                    subTypes.push(implementedByType.reflection);
                    subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(implementedByType.reflection));
                }
            }
        }

        return TypeDocUtils.removeDuplicatesFromReflectionArray(subTypes);
    }

    /**
     * Removes duplicates from an array of reflections.
     * @param reflections The array from which duplicates should be removed.
     * @returns The new array without duplicates.
     */
    protected static removeDuplicatesFromReflectionArray(
        reflections: DeclarationReflection[]
    ): DeclarationReflection[] {
        if (reflections.length === 0) {
            return [];
        }

        const newArray = new Array<DeclarationReflection>(); // this array is returned

        // We use a map and the reflection's name as the key to remove duplicates.
        const mapObj = new Map<string, DeclarationReflection>();

        for (const ref of reflections) {
            if (ref) {
                mapObj.set(ref.name, ref);
            }
        }

        for (const name of Array.from(mapObj.keys())) {
            newArray.push(mapObj.get(name) as DeclarationReflection);
        }

        return newArray;
    }
}
