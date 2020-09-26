import { DeclarationReflection, ReferenceType } from "typedoc/dist/lib/models/index";

/**
 * Removes duplicates from an array of types.
 * @param types The array from which duplicates should be removed.
 * @returns The new array without duplicates.
 */
function removeDuplicatesFromTypeArray(types: ReadonlyArray<ReferenceType>): ReferenceType[] {
    if (types.length === 0) {
        return [];
    }

    const newArray = new Array<ReferenceType>(); // this array is returned

    // We use a map and the types' fully qualified name as the key to remove duplicates.
    const mapObj = new Map<string, ReferenceType>();

    for (const ref of types) {
        mapObj.set(ref.name, ref);
    }

    for (const name of Array.from(mapObj.keys())) {
        newArray.push(mapObj.get(name) as ReferenceType);
    }

    return newArray;
}

/**
 * Returns all (recursive) types the given reflection is extending or implementing.
 * @param reflection The reflection whoes parent types are wanted.
 * @returns The types the given reflection is extending or implementing.
 */
function getParentTypesForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
    let parentTypes = new Array<ReferenceType>();

    // add all extended types of the reflection
    if (reflection.extendedTypes) {
        for (const extendedType of reflection.extendedTypes) {
            if (extendedType instanceof ReferenceType) {
                parentTypes.push(extendedType);

                if (extendedType.reflection instanceof DeclarationReflection) {
                    parentTypes = parentTypes.concat(getParentTypesForReflection(extendedType.reflection));
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
                    parentTypes = parentTypes.concat(getParentTypesForReflection(implementedType.reflection));
                }
            }
        }
    }

    return removeDuplicatesFromTypeArray(parentTypes);
}

/**
 * Returns all (recursive) types the given reflection is extended by or implemented by.
 * @param reflection The reflection whoes sub types are wanted.
 * @returns The types the given reflection is extended by or implemented by.
 */
function getSubTypesForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
    let subTypes = new Array<ReferenceType>();

    // add all extensions of the reflection
    if (reflection.extendedBy) {
        for (const extendedByType of reflection.extendedBy) {
            if (extendedByType instanceof ReferenceType) {
                subTypes.push(extendedByType);

                if (extendedByType.reflection instanceof DeclarationReflection) {
                    subTypes = subTypes.concat(getSubTypesForReflection(extendedByType.reflection));
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
                    subTypes = subTypes.concat(getSubTypesForReflection(implementedByType.reflection));
                }
            }
        }
    }

    return removeDuplicatesFromTypeArray(subTypes);
}

/**
 * Returns the types the given reflection is extending.
 * @param reflection The reflection whoes extended types are wanted.
 * @returns The types the given reflection is extending.
 */
export function getExtendedTypesForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
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
export function getExtendedBysForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
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
export function getImplementedTypesForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
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
                if (extendedType instanceof ReferenceType && extendedType.reflection instanceof DeclarationReflection) {
                    extendedTypeParents = extendedTypeParents.concat(
                        getParentTypesForReflection(extendedType.reflection),
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
export function getImplementedBysForReflection(reflection: Readonly<DeclarationReflection>): ReferenceType[] {
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
                    getSubTypesForReflection(implementedBy.reflection),
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
 * Returns if a reflection has any types above or below it in the class hierarchy.
 * @param reflection The reflection to check.
 * @returns True, if the reflection has any types above or below it in the class hierarchy, otherwise false.
 */
export function reflectionIsPartOfClassHierarchy(reflection: Readonly<DeclarationReflection>): boolean {
    if (
        getExtendedTypesForReflection(reflection).length > 0 ||
        getExtendedBysForReflection(reflection).length > 0 ||
        getImplementedTypesForReflection(reflection).length > 0 ||
        getImplementedBysForReflection(reflection).length > 0
    ) {
        return true;
    }

    return false;
}
