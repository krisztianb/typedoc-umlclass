/**
 * Well known sections of a TypeDoc page.
 */
export const enum PageSections {
    Hierarchy = "Hierarchy",
}

export class PageSection {
    /**
     * Creates HTML for a section containing a hierarchy diagram.
     * @param title The title of the section.
     * @param imageUrl The URL to the hierarchy diagram.
     * @param reflectionName The name of the reflection for which the hierarchy diagram was generated.
     * @returns The HTML for the section.
     */
    public static createForHierarchyDiagram(title: string, imageUrl: string, reflectionName: string): string {
        // URLs with data are not clickable in browsers for security concerns
        if (imageUrl.startsWith("data:")) {
            return `<section class="tsd-panel tsd-hierarchy-diagram">
                        <h3>${title}</h3>
                        <img class="uml-class" src="${imageUrl}"
                             alt="UML class diagram of ${reflectionName}"
                             title="Right click and select 'View image' to enlarge" />
                    </section>\n`;
        } else {
            return `<section class="tsd-panel tsd-hierarchy-diagram">
                        <h3>${title}</h3>
                        <a class="uml-class" href="${imageUrl}" title="Click to enlarge">
                            <img src="${imageUrl}"
                                 alt="UML class diagram of ${reflectionName}" />
                        </a>
                    </section>\n`;
        }
    }
}
