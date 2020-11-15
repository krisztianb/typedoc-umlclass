[![NPM Version](https://badge.fury.io/js/typedoc-umlclass.svg)](https://badge.fury.io/js/typedoc-umlclass) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-umlclass

**Plugin for TypeDoc that generates UML class diagrams**

## Usage

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and
this plugin is going to create a UML class diagram for every class and interface within your project.

Example:

![Example default style](https://krisztianb.github.io/typedoc-umlclass/docs/human-default-layout.png)

## Installation

The plugin can then be installed using [npm](https://www.npmjs.com/package/typedoc-umlclass):

```sh
$ npm install --save-dev typedoc-umlclass
```

**Note:** This plugin requires [JAVA](https://www.java.com/) and [Graphviz](https://graphviz.org/) to be installed on
your system.

## Options

The following options are added to TypeDoc when the plugin is installed.

### Basic settings

| Name | Description | Default |
| ---- | ----------- | ------- |
| `umlClassDiagramType` | You can use this option to disable the plugin by passing the value `none`. Otherwise a class diagram is generated for every class and interface that is involved in inheritance and/or implementation. The class diagram includes one level of base and sub classes. Use the value `simple` to only render the name of the class or interface. Use the value `detailed` to also render properties and methods. | `detailed` |
| `umlClassDiagramLocation` | Specifies the location of the generated uml images. If `local` then local image files are created in the assets directory of the generated documentation. If `remote` then the image tag uses an encoded link to the [plantuml server](http://www.plantuml.com/plantuml/). If `embed` then the image is directly embedded into the HTML as a base64 encoded string. | `local` |
| `umlClassDiagramFormat` | Specifies the format the generated images should have. You can choose between `png` and `svg`. | `svg` |

### HTML output

-   `--umlClassDiagramSectionTitle <string>`<br>
    Use this option to specify the title of the section on the TypeDoc page which includes the class diagram.
    Default is `Hierarchy-Diagram`.
-   `--umlClassDiagramPosition <above|below>`<br>
    Use this option to specify if the class diagram should be inserted `above` or `below` the default hierarchy section
    on the TypeDoc page.
    Default is `above`.
-   `--umlClassDiagramLegendType <none|only-included|full>`<br>
    Use this option to add a legend below each class diagram explaining the icons (eg: visibility of properties and
    methods) used in it. If `full` every legend contains every possible icon in a class diagram. If `only-included`
    every legend contains only the icons that are included in the class diagram. The content of the legends is affected
    by the options `umlClassDiagramMemberVisibilityStyle` and `umlClassDiagramHideCircledChar`.
    Default is `only-included`.

### Class diagram formating

-   `--umlClassDiagramMethodParameterOutput <none|only-names|only-types|complete>`<br>
    Specifies how method parameters should be included in the class diagram. Use `none` to completely omit parameters,
    `only-names` to include only parameter names, `only-types` to include only parameter types and `complete` to include
    names and types.
    Default is `complete`.
-   `--umlClassDiagramMemberOrder <abc|public-to-private|private-to-public>`<br>
    Specifies the order of properties and methods within the boxes in the class diagram. Use `abc` to sort them
    alphabetically, `public-to-private` to have public properties/methods before protected and private ones or
    `private-to-public` to have private properties/methods before protected and public ones.
    Default is `public-to-private`.
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

### Other settings

-   `--umlClassDiagramGeneratorProcessCount <integer>`<br>
    Generating many diagrams can take several minutes. You can use this option to define how many PlantUML JAVA
    processes should be used to generate the diagrams. The work is evenly scheduled among these processes. To increase
    the performance of the plugin, it is a good idea to set this value to the number of CPUs that are available.
    Default is `1`.
-   `--umlClassDiagramHideProgressBar <true|false>`<br>
    Since generating many diagrams can take several minutes the plugin displays a progress bar when the diagrams are
    created as local files or embedded into the HTML. No progress bar is displayed when generating remote URLs. If other
    plugins also output information to the console then the progress bar can disturb that output. If this is the case
    you can disable the progress bar of this plugin using the value `true`.
    Default is `false`.
-   `--umlClassDiagramCreatePlantUmlFiles <true|false>`<br>
    If this option is set to `true` the plugin creates a text file for every class or interface for which a class
    diagram is generated. The file contains the PlantUML code that was used to create the diagram. The files are stored
    in the assets directory of the generated documentation.
    Default is `false`.
-   `--umlClassDiagramVerboseOutput <true|false>`<br>
    If this option is set to `true` the plugin outputs messages to the console during its work. Use this option to
    debug possible plugin issues.
    Default is `false`.

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-umlclass/issues). Thanks for your contribution!

## Credits

I would like to thank the following people that influenced this project:

-   [Meir Gottlieb](https://github.com/meirgottlieb) for his
    [typedoc-plantuml](https://github.com/artifacthealth/typedoc-plantuml/) plugin of which this plugin first was a
    fork of.
-   [Michael K](https://github.com/0815fox) for his (unfinished) extension/fork to that plugin which gave me some
    insights into TypeDoc renderer events.
-   [Gerrit Birkeland](https://github.com/Gerrit0) for his help on questions about TypeDoc.
-   [Youssef Boujraf](https://github.com/yboujraf) for his impulse to create a separate plugin and help with testing it.

## Donate

If you find this piece of software helpful, please consider a donation. Any amount is greatly appreciated.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

## License

Licensed under ISC.
