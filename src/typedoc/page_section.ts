/**
 * Well known sections of a TypeDoc page.
 */
export const enum PageSections {
    Hierarchy = "Hierarchy",
}

/**
 * Creates HTML for a section containing a hierarchy diagram.
 * @param title The title of the section.
 * @param imageUrl The URL to the hierarchy diagram.
 * @param reflectionName The name of the reflection for which the hierarchy diagram was generated.
 * @param legendHtml Possbile HTML for the diagram's legend.
 * @returns The HTML for the section.
 */
export function createHierarchyDiagramSection(
    title: string,
    imageUrl: string,
    reflectionName: string,
    legendHtml?: string,
): string {
    // URLs with data are not clickable in browsers for security concerns => just output an image tag
    if (imageUrl.startsWith("data:")) {
        return `<section class="tsd-panel tsd-hierarchy-diagram">
                    <h4>${title}</h4>
                    <img class="diagram" src="${imageUrl}"
                            alt="UML class diagram of ${reflectionName}"
                            title="Right click and select 'View image' to enlarge" />
                    ${legendHtml ?? ""}
                </section>\n`;
    }
    return `<section class="tsd-panel tsd-hierarchy-diagram">
                <h4>${title}</h4>
                <a class="diagram" href="${imageUrl}" title="Click to enlarge">
                    <img src="${imageUrl}"
                            alt="UML class diagram of ${reflectionName}" />
                </a>
                ${legendHtml ?? ""}
            </section>\n`;
}
