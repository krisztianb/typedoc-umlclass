import { type DeclarationReflection } from "typedoc";

/** Type for a reflection compare function for sorting reflections. */
export type TypeDocMemberCompareFunction = (
    a: Readonly<DeclarationReflection>,
    b: Readonly<DeclarationReflection>,
) => number;

/**
 * Compare function for sorting reflections by their name alphabetically.
 * @param a First reflection.
 * @param b Second reflection.
 * @returns -1 if (a < b), 0 if (a === b) or 1 if (a > b).
 */
export const nameAbc: TypeDocMemberCompareFunction = (
    a: Readonly<DeclarationReflection>,
    b: Readonly<DeclarationReflection>,
): number => {
    const aName = a.name.toUpperCase();
    const bName = b.name.toUpperCase();

    if (aName < bName) {
        return -1;
    } else if (aName > bName) {
        return 1;
    }

    return 0;
};

/**
 * Compare function for sorting reflections by their visibility (public to private).
 * @param a First reflection.
 * @param b Second reflection.
 * @returns -1 if (a < b), 0 if (a === b) or 1 if (a > b).
 */
export const publicToPrivate: TypeDocMemberCompareFunction = (
    a: Readonly<DeclarationReflection>,
    b: Readonly<DeclarationReflection>,
): number => {
    if (a.flags.isProtected) {
        if (b.flags.isProtected) {
            return nameAbc(a, b);
        } else if (b.flags.isPrivate) {
            return -1;
        }
        return 1;
    } else if (a.flags.isPrivate) {
        if (b.flags.isProtected) {
            return 1;
        } else if (b.flags.isPrivate) {
            return nameAbc(a, b);
        }
        return 1;
    }
    if (b.flags.isProtected) {
        return -1;
    } else if (b.flags.isPrivate) {
        return -1;
    }
    return nameAbc(a, b);
};

/**
 * Compare function for sorting reflections by their visibility (private to public).
 * @param a First reflection.
 * @param b Second reflection.
 * @returns -1 if (a < b), 0 if (a === b) or 1 if (a > b).
 */
export const privateToPublic: TypeDocMemberCompareFunction = (
    a: Readonly<DeclarationReflection>,
    b: Readonly<DeclarationReflection>,
): number => {
    if (a.flags.isProtected) {
        if (b.flags.isProtected) {
            return nameAbc(a, b);
        } else if (b.flags.isPrivate) {
            return 1;
        }
        return -1;
    } else if (a.flags.isPrivate) {
        if (b.flags.isProtected) {
            return -1;
        } else if (b.flags.isPrivate) {
            return nameAbc(a, b);
        }
        return -1;
    }
    if (b.flags.isProtected) {
        return 1;
    } else if (b.flags.isPrivate) {
        return 1;
    }
    return nameAbc(a, b);
};
