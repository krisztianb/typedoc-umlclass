import { DeclarationReflection, ReferenceType } from "typedoc/dist/lib/models/index";

/**
 * Class with utility functions regarding TypeDoc reflections.
 */
export class TypeDocUtils {
    /**
     * Returns if a reflection has any types above or below it in the class hierarchy.
     * @param reflection The reflection to check.
     * @returns True, if the reflection has any types above or below it in the class hierarchy, otherwise false.
     */
    public static reflectionIsPartOfClassHierarchy(reflection: DeclarationReflection): boolean {
        if (
            TypeDocUtils.getExtendedTypesForReflection(reflection).length > 0 ||
            TypeDocUtils.getExtendedBysForReflection(reflection).length > 0 ||
            TypeDocUtils.getImplementedTypesForReflection(reflection).length > 0 ||
            TypeDocUtils.getImplementedBysForReflection(reflection).length > 0
        ) {
            return true;
        }

        return false;
    }

    /**
     * Returns the types the given reflection is extending.
     * @param reflection The reflection whoes extended types are wanted.
     * @returns The types the given reflection is extending.
     */
    public static getExtendedTypesForReflection(reflection: DeclarationReflection): ReferenceType[] {
        const extendedTypes = new Array<ReferenceType>();

        if (reflection.extendedTypes) {
            for (const extendedType of reflection.extendedTypes) {
                if (extendedType instanceof ReferenceType) {
                    extendedTypes.push(extendedType);
                }
            }
        }

        return extendedTypes;
    }

    /**
     * Returns the types that are extending the given reflection.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The types that are extending the given reflection.
     */
    public static getExtendedBysForReflection(reflection: DeclarationReflection): ReferenceType[] {
        const extendedBys = new Array<ReferenceType>();

        if (reflection.extendedBy) {
            for (const extendedByType of reflection.extendedBy) {
                if (extendedByType instanceof ReferenceType) {
                    extendedBys.push(extendedByType);
                }
            }
        }

        return extendedBys;
    }

    /**
     * Returns the types the given reflection is implementing.
     * @param reflection The reflection whoes implemented types are wanted.
     * @returns The types the given reflection is implementing.
     */
    public static getImplementedTypesForReflection(reflection: DeclarationReflection): ReferenceType[] {
        const implementedTypes = new Array<ReferenceType>();

        if (reflection.implementedTypes) {
            // build a list of all implemented types of the reflection
            // note: this list also includes all implemented types that base classes are implementing
            for (const implementedType of reflection.implementedTypes) {
                if (implementedType instanceof ReferenceType) {
                    implementedTypes.push(implementedType);
                }
            }

            if (reflection.extendedTypes) {
                let extendedTypeParents = new Array<ReferenceType>();

                // build a list of all parent types of the extended types
                for (const extendedType of reflection.extendedTypes) {
                    if (
                        extendedType instanceof ReferenceType &&
                        extendedType.reflection instanceof DeclarationReflection
                    ) {
                        extendedTypeParents = extendedTypeParents.concat(
                            TypeDocUtils.getParentTypesForReflection(extendedType.reflection),
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
     * Returns the types that are implementing the given reflection.
     * @param reflection The reflection whoes implementations are wanted.
     * @returns The types that are implementing the given reflection.
     */
    public static getImplementedBysForReflection(reflection: DeclarationReflection): ReferenceType[] {
        const implementedBys = new Array<ReferenceType>();

        if (reflection.implementedBy) {
            // build a list of all implementations of the reflection
            // note: this list also includes sub classes
            for (const implementedByType of reflection.implementedBy) {
                if (implementedByType instanceof ReferenceType) {
                    implementedBys.push(implementedByType);
                }
            }

            // build a list of all sub types of the implementations
            let implementedBySubTypes = new Array<ReferenceType>();

            for (const implementedBy of implementedBys) {
                if (implementedBy.reflection instanceof DeclarationReflection) {
                    implementedBySubTypes = implementedBySubTypes.concat(
                        TypeDocUtils.getSubTypesForReflection(implementedBy.reflection),
                    );
                }
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
     * Returns all (recursive) types the given reflection is extending or implementing.
     * @param reflection The reflection whoes parent types are wanted.
     * @returns The types the given reflection is extending or implementing.
     */
    protected static getParentTypesForReflection(reflection: DeclarationReflection): ReferenceType[] {
        let parentTypes = new Array<ReferenceType>();

        // add all extended types of the reflection
        if (reflection.extendedTypes) {
            for (const extendedType of reflection.extendedTypes) {
                if (extendedType instanceof ReferenceType) {
                    parentTypes.push(extendedType);

                    if (extendedType.reflection instanceof DeclarationReflection) {
                        parentTypes = parentTypes.concat(
                            TypeDocUtils.getParentTypesForReflection(extendedType.reflection),
                        );
                    }
                }
            }
        }

        // add all implemented types of the reflection
        if (reflection.implementedTypes) {
            for (const implementedType of reflection.implementedTypes) {
                if (implementedType instanceof ReferenceType) {
                    parentTypes.push(implementedType);

                    if (implementedType.reflection instanceof DeclarationReflection) {
                        parentTypes = parentTypes.concat(
                            TypeDocUtils.getParentTypesForReflection(implementedType.reflection),
                        );
                    }
                }
            }
        }

        return TypeDocUtils.removeDuplicatesFromTypeArray(parentTypes);
    }

    /**
     * Returns all (recursive) types the given reflection is extended by or implemented by.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The types the given reflection is extended by or implemented by.
     */
    protected static getSubTypesForReflection(reflection: DeclarationReflection): ReferenceType[] {
        let subTypes = new Array<ReferenceType>();

        // add all extensions of the reflection
        if (reflection.extendedBy) {
            for (const extendedByType of reflection.extendedBy) {
                if (extendedByType instanceof ReferenceType) {
                    subTypes.push(extendedByType);

                    if (extendedByType.reflection instanceof DeclarationReflection) {
                        subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(extendedByType.reflection));
                    }
                }
            }
        }

        // add all implementations of the reflection
        if (reflection.implementedBy) {
            for (const implementedByType of reflection.implementedBy) {
                if (implementedByType instanceof ReferenceType) {
                    subTypes.push(implementedByType);

                    if (implementedByType.reflection instanceof DeclarationReflection) {
                        subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(implementedByType.reflection));
                    }
                }
            }
        }

        return TypeDocUtils.removeDuplicatesFromTypeArray(subTypes);
    }

    /**
     * Removes duplicates from an array of types.
     * @param types The array from which duplicates should be removed.
     * @returns The new array without duplicates.
     */
    private static removeDuplicatesFromTypeArray(types: ReferenceType[]): ReferenceType[] {
        if (types.length === 0) {
            return [];
        }

        const newArray = new Array<ReferenceType>(); // this array is returned

        // We use a map and the types' fully qualified name as the key to remove duplicates.
        const mapObj = new Map<string, ReferenceType>();

        for (const ref of types) {
            if (ref) {
                mapObj.set(ref.name, ref);
            }
        }

        for (const name of Array.from(mapObj.keys())) {
            newArray.push(mapObj.get(name) as ReferenceType);
        }

        return newArray;
    }
}
