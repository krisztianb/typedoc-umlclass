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
        format: "svg",
    },
};
