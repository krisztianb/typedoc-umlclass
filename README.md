# typedoc-umlclass

**Plugin for TypeDoc that generates uml class diagrams**

[![NPM Version](https://badge.fury.io/js/typedoc-umlclass.svg)](https://badge.fury.io/js/typedoc-umlclass)

## Usage

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and
this plugin is going to create a UML class diagram for every class and interface within your project.

Example (default style):

![Example default style](https://krisztianb.github.io/typedoc-umlclass/docs/human-default-layout.png)

Example (styled using plugin options):

![Example styled using plugin options](https://krisztianb.github.io/typedoc-umlclass/docs/human-custom-layout.png)

## Installation

The plugin can then be installed using [npm](https://www.npmjs.com/package/typedoc-umlclass):

```sh
$ npm install typedoc-umlclass --save-dev
```

## Options

The following options are added to TypeDoc when the plugin is installed.

### Basic settings

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
    Default is `svg`.
-   `--umlClassDiagramMethodParameterOutput <none|only-names|only-types|complete>`<br>
    Specifies how method parameters should be included in the class diagram. Use `none` to completely omit parameters,
    `only-names` to include only parameter names, `only-types` to include only parameter types and `complete` to include
    names and types.
    Default is `complete`.

### HTML output

-   `--umlClassDiagramSectionTitle <string>`<br>
    Use this option to specify the title of the section on the TypeDoc page which includes the class diagram.
    Default is `Hierarchy-Diagram`.
-   `--umlClassDiagramPosition <above|below>`<br>
    Use this option to specify if the class diagram should be inserted `above` or `below` the default hierarchy section
    on the TypeDoc page.
    Default is `above`.

### Class diagram formating

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

I would like to thank the following people that influenced this project:

-   [Meir Gottlieb](https://github.com/meirgottlieb) for his
    [typedoc-plantuml](https://github.com/artifacthealth/typedoc-plantuml/) plugin of which this plugin first was a
    fork of.
-   [Michael K](https://github.com/0815fox) for his (unfinished) extension/fork to that plugin which gave me some
    insights into TypeDoc renderer events.
-   [Gerrit Birkeland](https://github.com/Gerrit0) for his help on questions about TypeDoc.
-   [yboujraf](https://github.com/yboujraf) for his impulse to create a separate plugin and help with testing it.

## License

Licensed under ISC.
