import { type PageSections } from "./page_section.js";
import { PageSectionFinder } from "./page_section_finder.js";

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
    public constructor(content?: string) {
        this._content = content ?? "";
    }

    /**
     * Returns the current content of the page.
     * @returns The current content of the page.
     */
    public get content(): string {
        return this._content;
    }

    /**
     * Inserts new content above a given section.
     * @param section The section above which the content should be inserted.
     * @param newContent The content to insert.
     */
    public insertAboveSection(section: PageSections, newContent: string): void {
        const sectionLocation = PageSectionFinder.getSectionLocation(this._content, section);

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
        const sectionLocation = PageSectionFinder.getSectionLocation(this._content, section);

        if (sectionLocation.startIndex !== sectionLocation.endIndex) {
            this._content =
                this._content.substring(0, sectionLocation.endIndex) +
                newContent +
                this._content.substring(sectionLocation.endIndex);
        }
    }
}
