/**
 * Class for generating the HTML for a diagram legend.
 */
export class DiagramLegend {
    /**
     * Creates the HTML for a diagram legend.
     * @param memberVisbilityIsIcons Specifies if the visibility of members should be described for icons.
     * @param describeCircledChars Specifies if the legend should include the definition of the circled chars.
     * @returns The HTML for the diagram legend.
     */
    public static createHtml(memberVisbilityIsIcons: boolean, describeCircledChars: boolean): string {
        let legend = `<hr class="uml-class-legend" />
                      <table class="uml-class-legend">
                         <tr>
                             <th colspan="6">Legend</th>
                         </tr>`;

        if (describeCircledChars) {
            legend += `<tr>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.ClassCircledChar}" /></td>
                           <td class="uml-class-legend-definition">class</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.AbstractClassCircledChar}" /></td>
                           <td class="uml-class-legend-definition">abstract class</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.InterfaceCircledChar}" /></td>
                           <td class="uml-class-legend-definition">interface</td>
                       </tr>`;
        }

        if (memberVisbilityIsIcons) {
            legend += `<tr>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.PublicProperty}" /></td>
                           <td class="uml-class-legend-definition">public property</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.ProtectedProperty}" /></td>
                           <td class="uml-class-legend-definition">protected property</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.PprivateProperty}" /></td>
                           <td class="uml-class-legend-definition">private property</td>
                       </tr>
                       <tr>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.PublicMethod}" /></td>
                           <td class="uml-class-legend-definition">public method</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.ProtectedMethod}" /></td>
                           <td class="uml-class-legend-definition">protected method</td>
                           <td class="uml-class-legend-defined"><img src="data:image/svg+xml;base64,${Image.PrivateMethod}" /></td>
                           <td class="uml-class-legend-definition">private method</td>
                       </tr>`;
        } else {
            legend += `<tr>
                           <td class="uml-class-legend-defined">+</td>
                           <td class="uml-class-legend-definition">public property/method</td>
                           <td class="uml-class-legend-defined">#</td>
                           <td class="uml-class-legend-definition">protected property/method</td>
                           <td class="uml-class-legend-defined">-</td>
                           <td class="uml-class-legend-definition">private property/method</td>
                       </tr>`;
        }

        legend += `<tr>
                       <td class="uml-class-legend-defined"><u>underlined</u></td>
                       <td class="uml-class-legend-definition">static property/method</td>
                       <td class="uml-class-legend-defined"><i>italic</i></td>
                       <td class="uml-class-legend-definition">abstract property/method</td>
                   </tr>
               </table>`;

        return legend;
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
