[![NPM Version](https://badge.fury.io/js/typedoc-umlclass.svg)](https://badge.fury.io/js/typedoc-umlclass) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

# typedoc-umlclass

This is a plugin for [TypeDoc](https://github.com/TypeStrong/typedoc) that automatically generates UML class diagrams from your code and inserts them into the doc pages of your classes and interfaces.

The following example shows the output generated in the doc page of the class `Human` which extends one class `Animal`, implements one interface `IWorker` and from which one class `Zombie` is derived.

![Example with custom style](https://krisztianb.github.io/typedoc-umlclass/docs/example.png)

## Requirements

This plugin requires the following software to be installed on your system:

* [JAVA](https://www.java.com/) (latest version)
* [Graphviz](https://graphviz.org/) (latest version)
* [TypeDoc](https://typedoc.org/) (supported versions: 0.24.x, 0.25.x and 0.26.5 or above)

## Installation

Like TypeDoc this plugin should be installed as a dev dependency using [npm](https://www.npmjs.com/package/typedoc-umlclass):

```sh
$ npm install --save-dev typedoc-umlclass
```

After installing the plugin you need to activate it with a [TypeDoc command line argument](https://typedoc.org/options/configuration/#plugin) or the `plugin` option in your TypeDoc config file (see example below).

## Options

The option `umlClassDiagram` is added to TypeDoc when the plugin is installed. The option is an object whose properties
can be used to configure the plugin within your [TypeDoc config file](https://typedoc.org/guides/options/).

Here is an example using a strictly-typed JavaScript config file with the style settings for the diagram above:

```js
/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-umlclass').Config } */
module.exports = {
    entryPoints: ["./src/index.ts"],
    out: "doc",
    plugin: ["typedoc-umlclass"], // <===== Turn this plugin on for TypeDoc
    umlClassDiagram: { // <=========== Use this object to configure this plugin
        type: "detailed",
        location: "local",
        format: "svg",
        legendType: "only-included",
        hideShadow: false,
        style: {
            box: {
                backgroundColor: "fcf2cc",
                border: {
                    width: 2,
                    color: "5a0000",
                    radius: 0
                }
            },
            class: {
                name: {
                    font: {
                        bold: true
                    }
                }
            },
            property: {
                name: {
                    font: {
                        bold: true
                    }
                },
                type: {
                    font: {
                        color: "26009966"
                    }
                }
            },
            method: {
                parameter: {
                    name: {
                        font: {
                            color: "780000"
                        }
                    },
                    type: {
                        font: {
                            color: "26009966"
                        }
                    }
                },
                returnType: {
                    font: {
                        color: "26009966"
                    }
                }
            }
        }
    }
};
```

### Basic settings

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
| **type** `<none\|simple\|detailed>` | You can disable the plugin by passing the value `none`. Otherwise a class diagram is generated for every class and interface that is involved in inheritance and/or implementation. The class diagram includes one level of base and sub classes. Use the value `simple` to only render the name of the class or interface. Use the value `detailed` to also render properties and methods. | `detailed` |
| **location** `<local\|remote\|embed>` | Specifies the location of the generated images. If `local` then local image files are created in the assets directory of the generated documentation. If `remote` then the image tag uses an encoded link to a PlantUML web server that you can specify using the `remoteBaseUrl` option. If `embed` then the image is directly embedded into the HTML as a base64 encoded string. | `local` |
| **remoteBaseUrl** `<string>` | Specifies the base URL that is used when generating remote image URLs. An example image URL is `http://www.plantuml.com/plantuml/svg/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000` from which `http://www.plantuml.com` is the base URL. You can use this option if you are running your own [PlantUML PicoWeb Server](https://plantuml.com/picoweb). | `http://www.plantuml.com` |
| **format** `<png\|svg>` | Specifies the format the generated images should have. You can choose between `png` and `svg`. | `svg` |

### HTML output

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
| **sectionTitle** `<string>` | Specifies the title of the section on the TypeDoc page which includes the class diagram. | `Hierarchy-Diagram` |
| **position** `<above\|below>` | Specifies if the class diagram should be inserted `above` or `below` the default hierarchy section on the TypeDoc page. | `above` |
| **legendType** `<none\|only-included\|full>` | Use this option to add a legend below each class diagram explaining the icons (eg: visibility of properties and methods) used in it. If `full` every legend contains every possible icon in a class diagram. If `only-included` every legend contains only the icons that are included in the class diagram. | `only-included` |

### Class diagram formating

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
| **methodParameterOutput** `<none\|only-names\|only-types\|complete>`| Specifies how method parameters should be included in the class diagram. Use `none` to completely omit parameters, `only-names` to include only parameter names, `only-types` to include only parameter types and `complete` to include names and types. | `complete` |
| **memberOrder** `<abc\|public-to-private\|private-to-public>` | Specifies the order of properties and methods within the boxes in the class diagram. Use `abc` to sort them alphabetically, `public-to-private` to have public properties/methods before protected and private ones or `private-to-public` to have private properties/methods before protected and public ones. | `public-to-private` |
| **topDownLayoutMaxSiblings** `<integer>` | Specifies the maximum number of allowed siblings above (extended types and implemented interfaces) and below (extending types and implementing interfaces) the current type. If this number is exceeded the PlantUML layout is switched from top/down to left/right to allow a better readability of the resulting class diagram. | `6` |
| **visibilityStyle** `<text\|icon>` | Specifies how the visibility (private, protected or public) of class members (properties and methods) should be rendered in the class diagrams. | `icon` |
| **hideEmptyMembers** `<true\|false>` | If this option is set to true properties and methods are hidden if they are empty. | `true` |
| **hideCircledChar** `<true\|false>` | If this option is set to true the circled char in front of class and interface names is omitted. | `false` |
| **hideShadow** `<true\|false>` | If this option is set to true the shadowing in the class diagrams is disabled. | `true` |
| **style** `object` | Enables you to use specific styling (fonts, colors, etc.) within your diagrams. See below. | If omitted the generated diagrams use PlantUML's standard settings for class diagrams. |

### Class diagram style

The `style` setting is an object that you can use to change the font settings, color and background color within your diagrams.
Since it is a nested object it is best described via a complete example.

```ts
style: {
    backgroundColor: "white", // this is the background color for the entire diagram
    box: {
        backgroundColor: "transparent",
        border: {
            width: 2,
            color: "A0A0A0",
            radius: 12
        }
    },
    arrow: {
        width: 1,
        color: "orange"
    },
    text: { // values specified with "text" are inherited by all other font settings below (where you can override them)
        font: {
            family: "Courier",
            size: 14,
            bold: true,
            italic: false,
            underline: false,
            strikeout: false
        },
        color: "0000FF",
        backgroundColor: "yellow"
    },
    class: {
        name: {
            font: {
                family: "Helvetica",
                size: 16,
                bold: false,
                italic: true,
                underline: false,
                strikeout: false
            },
            color: "0000FF",
            backgroundColor: "yellow"
        }
    },
    interface: {
        name: {
            font: {
                family: "Helvetica",
                size: 16,
                bold: false,
                italic: false,
                underline: true,
                strikeout: false
            },
            color: "0000FF",
            backgroundColor: "green"
        }
    },
    property: {
        name: {
            font: {
                family: "Helvetica",
                size: 12,
                bold: false,
                italic: false,
                underline: false,
                strikeout: false
            },
            color: "0000FF",
            backgroundColor: "green"
        },
        type: {
            font: {
                family: "Helvetica",
                size: 12,
                bold: false,
                italic: false,
                underline: false,
                strikeout: false
            },
            color: "0000FF",
            backgroundColor: "green"
        }
    },
    method: {
        name: {
            font: {
                family: "Helvetica",
                size: 12,
                bold: false,
                italic: false,
                underline: false,
                strikeout: false
            },
            color: "blue",
            backgroundColor: "green"
        },
        parameter: {
            name: {
                font: {
                    family: "Helvetica",
                    size: 12,
                    bold: false,
                    italic: false,
                    underline: false,
                    strikeout: false
                },
                color: "0000FF",
                backgroundColor: "gray"
            },
            type: {
                font: {
                    family: "Helvetica",
                    size: 12,
                    bold: false,
                    italic: false,
                    underline: false,
                    strikeout: false
                },
                color: "0000FF",
                backgroundColor: "pink"
            }
        },
        returnType: {
            font: {
                family: "Helvetica",
                size: 12,
                bold: false,
                italic: false,
                underline: false,
                strikeout: false
            },
            color: "neon",
            backgroundColor: "green"
        }
    }
}
```

Remarks:

- For class and interface names PlantUML doesn't seem to support setting the font to underlined or striked-out.
- For class and interface names PlantUML doesn't seem to support setting the font to bold and italic at the same time.
- For class and interface names PlantUML doesn't seem to support setting a background color.

### Other settings

| Name & Format | Description | Default |
| ------------- | ----------- | ------- |
**generatorProcessCount** `<integer>` | Generating many diagrams can take several minutes. You can use this option to define how many PlantUML JAVA processes should be used to generate the diagrams. The work is evenly scheduled among these processes. | The number of virtual cores available on your system. |
**hideProgressBar** `<true\|false>` | Since generating many diagrams can take several minutes the plugin displays a progress bar when the diagrams are created as local files or embedded into the HTML. No progress bar is displayed when generating remote URLs. If other plugins also output information to the console then the progress bar can disturb that output. If this is the case you can disable the progress bar of this plugin using the value `true`. | `false` |
**createPlantUmlFiles** `<true\|false>` | If this option is set to `true` the plugin creates a text file for every class or interface for which a class diagram is generated. The file contains the PlantUML code that was used to create the diagram. The files are stored in the assets directory of the generated documentation. | `false` |
**verboseOutput** `<true\|false>` | If this option is set to `true` the plugin outputs messages to the console during its work. Use this option to debug possible plugin issues. | `false` |

## Bugs

Please report bugs [here](https://github.com/krisztianb/typedoc-umlclass/issues). Thanks for your contribution!

## Credits

I thank the following people that influenced this project:

-   [Meir Gottlieb](https://github.com/meirgottlieb) for his
    [typedoc-plantuml](https://github.com/artifacthealth/typedoc-plantuml/) plugin of which this plugin first was a
    fork of.
-   [Michael K](https://github.com/0815fox) for his (unfinished) extension/fork to that plugin which gave me some
    insights into TypeDoc renderer events.
-   [Gerrit Birkeland](https://github.com/Gerrit0) for his help on questions about TypeDoc.
-   [Youssef Boujraf](https://github.com/yboujraf) for his impulse to create a separate plugin and help with testing it.

## Donate

If you find this plugin helpful, please consider a donation. Any amount is greatly appreciated and motivates me to keep this project up to date.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=67UU75EUH4S8A)

## License

Licensed under ISC.
