/**
 * Class for generating the HTML and CSS for a diagram legend.
 */
export class DiagramLegend {
    /**
     * Creates the HTML for a diagram legend.
     * @param memberVisbilityIsIcons Specifies if the visibility of members should be described for icons.
     * @param describeCircledChars Specifies if the legend should include the definition of the circled chars.
     * @returns The HTML for the diagram legend.
     */
    public static createHtml(memberVisbilityIsIcons: boolean, describeCircledChars: boolean): string {
        let legend = `<h4>Legend</h4>
                      <div class="legend">`;

        if (describeCircledChars) {
            legend += `<div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.ClassCircledChar}" alt="icon for a class in the UML class diagram" /></span>
                           <span class="dd">class</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.AbstractClassCircledChar}" alt="icon for an abstract class in the UML class diagram" /></span>
                           <span class="dd">abstract class</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.InterfaceCircledChar}" alt="icon for an interface in the UML class diagram" /></span>
                           <span class="dd">interface</span>
                       </div>`;
        }

        if (memberVisbilityIsIcons) {
            legend += `<div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.PublicProperty}" alt="icon for a public property in the UML class diagram" /></span>
                           <span class="dd">public property</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.ProtectedProperty}" alt="icon for a protected property in the UML class diagram" /></span>
                           <span class="dd">protected property</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.PprivateProperty}" alt="icon for a private property in the UML class diagram" /></span>
                           <span class="dd">private property</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.PublicMethod}" alt="icon for a public method in the UML class diagram" /></span>
                           <span class="dd">public method</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.ProtectedMethod}" alt="icon for a protected method in the UML class diagram" /></span>
                           <span class="dd">protected method</span>
                       </div>
                       <div>
                           <span class="dt"><img src="data:image/svg+xml;base64,${Image.PrivateMethod}" alt="icon for a private method in the UML class diagram" /></span>
                           <span class="dd">private method</span>
                       </div>`;
        } else {
            legend += `<div>
                           <span class="dt">+</span>
                           <span class="dd">public property/method</span>
                       </div>
                       <div>
                           <span class="dt">#</span>
                           <span class="dd">protected property/method</span>
                       </div>
                       <div>
                           <span class="dt">-</span>
                           <span class="dd">private property/method</span>
                       </div>`;
        }

        legend += `    <div>
                           <span class="dt underlined">underlined</span>
                           <span class="dd">static property/method</span>
                       </div>
                       <div>
                           <span class="dt italic">italic</span>
                           <span class="dd">abstract property/method</span>
                       </div>
                   </div>`;

        return legend;
    }

    /**
     * Returns the CSS that is required to format the HTML of the diagram legend.
     * @returns The CSS for the HTML of the diagram legend.
     */
    public static getCss(): string {
        return (
            ".tsd-hierarchy-diagram h4 { margin: 10px -20px 5px -20px; border-top: 1px solid #eee; padding: 10px 20px; }\n" +
            ".tsd-hierarchy-diagram .legend { display: flex; flex-flow: row wrap; align-items: center; font-size: 10px; }\n" +
            ".tsd-hierarchy-diagram .legend div { width: 185px; display: flex; flex-flow: row nowrap; align-items: center; height: 34px; }\n" +
            ".tsd-hierarchy-diagram .legend div span.dt { display: block; width: 55px; text-align: center; margin-right: 5px; }\n" +
            ".tsd-hierarchy-diagram .legend div span.dd { display: block; }\n" +
            ".tsd-hierarchy-diagram .legend div span.dt.underlined { text-decoration: underline; }\n" +
            ".tsd-hierarchy-diagram .legend div span.dt.italic { font-style: italic; }`\n"
        );
    }
}

/**
 * Collection of images used in the diagram legend.
 */
const enum Image {
    ClassCircledChar = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSIyM3B4IiBoZWlnaHQ9IjIzcHgiIHN0eWxlPSJ3aWR0aDoyM3B4O2hlaWdodDoyM3B4OyIgdmlld0JveD0iMCAwIDIzIDIzIj4NCjxnPg0KPGVsbGlwc2UgY3g9IjExLjUiIGN5PSIxMS41IiByeD0iMTEiIHJ5PSIxMSIgZmlsbD0iI0FERDFCMiIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+DQo8dGV4dCB4PSI3IiB5PSIxMS41IiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkNvdXJpZXIiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5DPC90ZXh0Pg0KPC9nPg0KPC9zdmc+",
    AbstractClassCircledChar = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSIyM3B4IiBoZWlnaHQ9IjIzcHgiIHN0eWxlPSJ3aWR0aDoyM3B4O2hlaWdodDoyM3B4OyIgdmlld0JveD0iMCAwIDIzIDIzIj4NCjxnPg0KPGVsbGlwc2UgY3g9IjExLjUiIGN5PSIxMS41IiByeD0iMTEiIHJ5PSIxMSIgZmlsbD0iI0E5RENERiIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+DQo8dGV4dCB4PSI3IiB5PSIxMS41IiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkNvdXJpZXIiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5BPC90ZXh0Pg0KPC9nPg0KPC9zdmc+",
    InterfaceCircledChar = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSIyM3B4IiBoZWlnaHQ9IjIzcHgiIHN0eWxlPSJ3aWR0aDoyM3B4O2hlaWdodDoyM3B4OyIgdmlld0JveD0iMCAwIDIzIDIzIj4NCjxnPg0KPGVsbGlwc2UgY3g9IjExLjUiIGN5PSIxMS41IiByeD0iMTEiIHJ5PSIxMSIgZmlsbD0iI0I0QTdFNSIgc3R5bGU9InN0cm9rZTogI0E4MDAzNjsgc3Ryb2tlLXdpZHRoOiAxLjA7Ii8+DQo8dGV4dCB4PSI3IiB5PSIxMS41IiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzAwMDAwMCIgZm9udC1mYW1pbHk9IkNvdXJpZXIiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5JPC90ZXh0Pg0KPC9nPg0KPC9zdmc+",
    PublicProperty = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI3cHgiIGhlaWdodD0iN3B4IiBzdHlsZT0id2lkdGg6N3B4O2hlaWdodDo3cHg7IiB2aWV3Qm94PSIwIDAgNyA3Ij4NCjxnPg0KPGVsbGlwc2UgY3g9IjMuNSIgY3k9IjMuNSIgcng9IjMiIHJ5PSIzIiBmaWxsPSJub25lIiBzdHlsZT0ic3Ryb2tlOiAjMDM4MDQ4OyBzdHJva2Utd2lkdGg6IDEuMDsiLz4NCjwvZz4NCjwvc3ZnPg==",
    ProtectedProperty = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI5cHgiIGhlaWdodD0iOXB4IiBzdHlsZT0id2lkdGg6OXB4O2hlaWdodDo5cHg7IiB2aWV3Qm94PSIwIDAgOSA5Ij4NCjxnPg0KPHBvbHlnb24gcG9pbnRzPSI0LjUsMC41LDguNSw0LjUsNC41LDguNSwwLjUsNC41IiBmaWxsPSJub25lIiBzdHlsZT0ic3Ryb2tlOiAjQjM4RDIyOyBzdHJva2Utd2lkdGg6IDEuMDsiLz4NCjwvZz4NCjwvc3ZnPg==",
    PprivateProperty = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI3cHgiIGhlaWdodD0iN3B4IiBzdHlsZT0id2lkdGg6N3B4O2hlaWdodDo3cHg7IiB2aWV3Qm94PSIwIDAgNyA3Ij4NCjxnPg0KPHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIGZpbGw9Im5vbmUiIHN0eWxlPSJzdHJva2U6ICNDODI5MzA7IHN0cm9rZS13aWR0aDogMS4wOyIvPg0KPC9nPg0KPC9zdmc+",
    PublicMethod = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI3cHgiIGhlaWdodD0iN3B4IiBzdHlsZT0id2lkdGg6N3B4O2hlaWdodDo3cHg7IiB2aWV3Qm94PSIwIDAgNyA3Ij4NCjxnPg0KPGVsbGlwc2UgY3g9IjMuNSIgY3k9IjMuNSIgcng9IjMiIHJ5PSIzIiBmaWxsPSIjODRCRTg0IiBzdHlsZT0ic3Ryb2tlOiAjMDM4MDQ4OyBzdHJva2Utd2lkdGg6IDEuMDsiLz4NCjwvZz4NCjwvc3ZnPg==",
    ProtectedMethod = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI5cHgiIGhlaWdodD0iOXB4IiBzdHlsZT0id2lkdGg6OXB4O2hlaWdodDo5cHg7IiB2aWV3Qm94PSIwIDAgOSA5Ij4NCjxnPg0KPHBvbHlnb24gcG9pbnRzPSI0LjUsMC41LDguNSw0LjUsNC41LDguNSwwLjUsNC41IiBmaWxsPSIjRkZGRjQ0IiBzdHlsZT0ic3Ryb2tlOiAjQjM4RDIyOyBzdHJva2Utd2lkdGg6IDEuMDsiLz4NCjwvZz4NCjwvc3ZnPg==",
    PrivateMethod = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgY29udGVudFN0eWxlVHlwZT0idGV4dC9jc3MiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHpvb21BbmRQYW49Im1hZ25pZnkiIHdpZHRoPSI3cHgiIGhlaWdodD0iN3B4IiBzdHlsZT0id2lkdGg6N3B4O2hlaWdodDo3cHg7IiB2aWV3Qm94PSIwIDAgNyA3Ij4NCjxnPg0KPHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIGZpbGw9IiNGMjRENUMiIHN0eWxlPSJzdHJva2U6ICNDODI5MzA7IHN0cm9rZS13aWR0aDogMS4wOyIvPg0KPC9nPg0KPC9zdmc+",
}
