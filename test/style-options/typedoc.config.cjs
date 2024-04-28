/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-umlclass').Config } */
module.exports = {
    entryPointStrategy: "expand",
    entryPoints: ["input/*.ts"],
    out: "output",
    tsconfig: "tsconfig.json",
    plugin: ["typedoc-umlclass"],
    umlClassDiagram: {
        type: "detailed",
        location: "local",
        format: "png",
        style: {
            backgroundColor: "white",
            box: {
                backgroundColor: "C0C0C0",
                border: {
                    width: 2,
                    color: "A0A0A0",
                    radius: 12,
                },
            },
            arrow: {
                color: "orange",
            },
            text: {
                font: {
                    family: "Courier",
                    size: 14,
                },
                color: "0000FF",
            },
            class: {
                name: {
                    font: {
                        size: 18,
                    },
                    color: "red",
                },
            },
            interface: {
                name: {
                    font: {
                        size: 18,
                    },
                    color: "red",
                },
            },
            property: {
                name: {
                    font: {
                        bold: true,
                    },
                    color: "green",
                },
                type: {
                    font: {
                        size: 8,
                    },
                    color: "purple",
                },
            },
            method: {
                name: {
                    font: {
                        bold: true,
                    },
                    color: "purple",
                },
                parameter: {
                    name: {
                        font: {
                            size: 12,
                            bold: true,
                        },
                        color: "gold",
                    },
                    type: {
                        font: {
                            size: 8,
                        },
                        color: "brown",
                    },
                },
                returnType: {
                    font: {
                        size: 8,
                        bold: true,
                    },
                },
            },
        },
    },
};
