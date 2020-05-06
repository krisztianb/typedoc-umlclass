/**
 * Well known sections of a TypeDoc page.
 */
export const enum PageSections {
    Hierarchy = "Hierarchy",
}

/**
 * Helper class for modifying TypeDoc page content.
 */
export class PageProcessor {
    /** The current content of the page. */
    private _content: string;

    /**
     * Creates a new PageProcessor with the content of the page.
     * @param content The content of the page.
     */
    constructor(content: string) {
        this._content = content;
    }

    /**
     * Returns the current content of the page.
     * @returns The current content of the page.
     */
    get content(): string {
        return this._content;
    }

    /**
     * Checks if the page is detail page for a class or reflection.
     * @returns True, if the page is a detail page, otherwise false.
     */
    get isDetailPage(): boolean {
        return this.hasSection(PageSections.Hierarchy);
    }

    /**
     * Inserts new content above a given section.
     * @param section The section above which the content should be inserted.
     * @param newContent The content to insert.
     */
    public insertAboveSection(section: PageSections, newContent: string): void {
        const sectionLocation = this.getSectionLocation(section);

        if (sectionLocation.startIndex !== sectionLocation.endIndex) {
            this._content =
                this._content.substring(0, sectionLocation.startIndex) +
                newContent +
                this._content.substring(sectionLocation.startIndex);
        }
    }

    /**
     * Inserts new content below a given section.
     * @param section The section below which the content should be inserted.
     * @param newContent The content to insert.
     */
    public insertBelowSection(section: PageSections, newContent: string): void {
        const sectionLocation = this.getSectionLocation(section);

        if (sectionLocation.startIndex !== sectionLocation.endIndex) {
            this._content =
                this._content.substring(0, sectionLocation.endIndex) +
                newContent +
                this._content.substring(sectionLocation.endIndex);
        }
    }

    /**
     * Checks if the page has a section with the given name.
     * @param sectionName The name of the section.
     * @returns True, if the page has a section with the given name, otherwise false.
     */
    private hasSection(sectionName: string): boolean {
        const regex = this.createRegexpForSection(sectionName);
        return regex.test(this._content);
    }

    /**
     * Returns a regular expression that can be used to match a section with a given name.
     * @param sectionName The name of the section.
     * @returns The regular expression to match the section.
     */
    private createRegexpForSection(sectionName: string): RegExp {
        return new RegExp('<section class="tsd-panel[^"<>]*?">\\s*<h3>' + sectionName + "</h3>[^]*?</section>");
    }

    /**
     * Returns the position of the section within the content.
     * @param sectionName The name of the section.
     * @returns An object with the start and end index of the section.
     *          If the section cannot be found in the content both startIndex and endIndex equal 0.
     */
    private getSectionLocation(sectionName: string): { startIndex: number; endIndex: number } {
        const regex = this.createRegexpForSection(sectionName);
        const match = regex.exec(this._content);

        if (match) {
            return { startIndex: match.index, endIndex: match.index + match[0].length };
        } else {
            return { startIndex: 0, endIndex: 0 };
        }
    }
}
