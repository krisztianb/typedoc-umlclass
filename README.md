# typedoc-umlclass

**Plugin for TypeDoc that generates uml class diagrams**

## Installation (NOT YET AVAILABLE)

The plugin can then be installed using [npm](https://www.npmjs.com/):

```sh
$ npm install typedoc-umlclass --save-dev
```

## Usage

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and
this plugin is going to create a UML class diagram for every class and interface within your project.

## Options

The following options are added to TypeDoc when the plugin is installed:

-   `--umlClassDiagramType <none|simple|detailed>`<br>
    You can use this option to disable the plugin by passing the value `none`. Otherwise a class diagram is generated
    for every class and interface that is involved in inheritance and/or implementation. The class diagram includes
    one level of base and sub classes. Use the value `simple` to only render the name of the class or interface.
    Use the value `detailed` to also render properties and methods.
    Default is `detailed`.
-   `--umlClassDiagramLocation <local|remote>`<br>
    Specifies the location of the generated uml images. If `local` then local image files are created in the assets
    directory of the generated documentation. If `remote` then the image tag uses an encoded link to the
    [plantuml server](http://www.plantuml.com/plantuml/).
    Default is `local`.
-   `--umlClassDiagramFormat <png|svg>`<br>
    Specifies the image format to use.
    Default is `png`.
-   `--umlClassDiagramSectionTitle <string>`<br>
    Use this option to specify the title of the section which includes the class diagram.
    Default is `Hierarchy-Diagram`.
-   `--umlClassDiagramPosition <above|below>`<br>
    Use this option to specify if the class diagram should be inserted `above` or `below` the hierarchy section.
    Default is `above`.
-   `--umlClassDiagramHideEmptyMembers <true|false>`<br>
    If this option is set to true properties and methods are hidden if they are empty.
    Default is `true`.
-   `--umlClassDiagramTopDownLayoutMaxSiblings <integer>`<br>
    Use this option to specify the maximum number of allowed siblings above (extended types and implemented interfaces)
    and below (extending types and implementing interfaces) the current type. If this number is exceeded the PlantUML
    layout is switched from top/down to left/right to allow a better readability of the resulting class diagram.
    Default value is `6`.
-   `--umlClassDiagramMemberVisibilityStyle <text|icon>`<br>
    Use this option to specify how the visibility (private, protected or public) of class members
    (properties and methods) should be rendered in the class diagrams.
    Default is `icon`.
-   `--umlClassDiagramHideCircledChar <true|false>`<br>
    If this option is set to true the circled char in front of class and interface names is omitted.
    Default is `false`.
-   `--umlClassDiagramHideShadow <true|false>`<br>
    If this option is set to true the shadowing in the class diagrams is disabled.
    Default is `false`.
-   `--umlClassDiagramBoxBackgroundColor <transparent|#RGBHEX>`<br>
    Use this option to specify the background color of the boxes within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramBoxBorderColor <transparent|#RGBHEX>`<br>
    Use this option to specify the border color of the boxes within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramBoxBorderRadius <integer>`<br>
    Use this option to specify the border radius of the boxes within the class diagram. Unit is pixel.
    Default value is `0`.
-   `--umlClassDiagramBoxBorderWidth <integer>`<br>
    Use this option to specify the border width of the boxes within the class diagram. Unit is pixel.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramArrowColor <transparent|#RGBHEX>`<br>
    Use this option to specify the color of the arrows within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontName <font-name>`<br>
    Use this option to specify the name of the font used for the class names within the class diagram.
    **The PlantUML site remarks:** _Please note the fontname is highly system dependent, so do not over use it,
    if you look for portability. Helvetica and Courier should be available on all system._
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontSize <integer>`<br>
    Use this option to specify the font size of the class names within the class diagram. Unit is pixel.
    Default value is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontStyle <normal|plain|italic|bold>`<br>
    Use this option to specify the style of the font used for the class names within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontColor <transparent|#RGBHEX>`<br>
    Use this option to specify the color of the class names within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassAttributeFontName <font-name>`<br>
    Use this option to specify the name of the font used for class attributes within the class diagram.
    **The PlantUML site remarks:** _Please note the fontname is highly system dependent, so do not over use it,
    if you look for portability. Helvetica and Courier should be available on all system._
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassAttributeFontSize <integer>`<br>
    Use this option to specify the font size of the class attributes within the class diagram. Unit is pixel.
    Default value is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassAttributeFontStyle <normal|plain|italic|bold>`<br>
    Use this option to specify the style of the font used for the class attributes within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassAttributeFontColor <transparent|#RGBHEX>`<br>
    Use this option to specify the color of the class attributes within the class diagram.
    Default is the PlantUML default value for this skin parameter.

## Credits

This plugin was inspired by the [typedoc-plantuml](https://github.com/artifacthealth/typedoc-plantuml/) plugin created
by [Meir Gottlieb](https://github.com/meirgottlieb) and the (unfinished) extension to that plugin created
by [Michael K](https://github.com/0815fox).

## License

Licensed under ISC.
