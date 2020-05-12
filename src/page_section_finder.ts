import { PageSections } from "./page_section";

/**
 * Helper class for finding sections on a TypeDoc page.
 */
export class PageSectionFinder {
    /** Map for caching regular expressions to find a section on a page. */
    private static readonly pageSectionLookUpCache = new Map<PageSections, RegExp>();

    /**
     * Returns the position of the section within the content.
     * @param content The content in which to look for the section.
     * @param section The section whos location is wanted.
     * @returns An object with the start and end index of the section.
     *          If the section cannot be found in the content both startIndex and endIndex equal 0.
     */
    public static getSectionLocationInContent(
        content: string,
        section: PageSections
    ): { startIndex: number; endIndex: number } {
        const regex = PageSectionFinder.getLookUpRegexpForSection(section);
        const match = regex.exec(content);

        if (match) {
            return { startIndex: match.index, endIndex: match.index + match[0].length };
        } else {
            return { startIndex: 0, endIndex: 0 };
        }
    }

    /**
     * Returns a regular expression that can be used to match a section.
     * @param section The section to match.
     * @returns The regular expression to match the section.
     */
    private static getLookUpRegexpForSection(section: PageSections): RegExp {
        if (!PageSectionFinder.pageSectionLookUpCache.has(section)) {
            PageSectionFinder.pageSectionLookUpCache.set(
                section,
                PageSectionFinder.createLookUpRegexpForSection(section)
            );
        }

        return PageSectionFinder.pageSectionLookUpCache.get(section) as RegExp;
    }

    /**
     * Creates a regular expression that can be used to match a section with a given name.
     * @param sectionName The name of the section.
     * @returns The regular expression to match the section.
     */
    private static createLookUpRegexpForSection(sectionName: string): RegExp {
        return new RegExp('<section class="tsd-panel[^"<>]*?">\\s*<h3>' + sectionName + "</h3>[^]*?</section>");
    }
}
