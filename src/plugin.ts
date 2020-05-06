import * as fs from "fs";
import * as path from "path";
import { Application, DeclarationReflection, Reflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { PlantUmlUtils } from "./plantuml_utils";
import {
    ClassDiagramMemberVisibilityStyle,
    ClassDiagramType,
    FontStyle,
    ImageFormat,
    ImageLocation,
    PluginOptions,
    ClassDiagramPosition,
} from "./plugin_options";
import { TypeDocUtils } from "./typedoc_utils";
import { ImageGenerator } from "./image_generator";
import { PageProcessor, PageSections } from "./page_processor";

/**
 * The UML class diagram generator plugin.
 *
 * # What does it do?
 *
 * This plugin generates an UML class diagram for classes and interfaces.
 *
 * # How does it do it?
 *
 * 1. The plugin scans through the classes and interfaces and generates PlantUML code for them.
 * 2. The plugin uses the node-plantuml module to generate image files from the PlantUML code.
 * 3. The plugin adds a section with the image to the page of each class and interface.
 */
export class Plugin {
    /** The options of this plugin. */
    private options = new PluginOptions();

    /** Used when the class diagrams are created locally. */
    private localImageGenerator = new ImageGenerator();

    /**
     * Stores the generated PlantUML code for the reflections.
     * KEY   = Unique ID of the reflection
     * VALUE = The PlantUML lines of code for the reflection
     */
    private reflectionPlantUmlMap = new Map<number, string[]>();

    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    public initialize(typedoc: Application): void {
        this.addOptionsToApplication(typedoc);
        this.subscribeToApplicationEvents(typedoc);
    }

    /**
     * Adds the plugin's options to the application's options.
     * @param typedoc The TypeDoc application.
     */
    private addOptionsToApplication(typedoc: Application): void {
        this.options.addToApplication(typedoc);
    }

    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     * @param typedoc The TypeDoc application.
     */
    private subscribeToApplicationEvents(typedoc: Application): void {
        typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Context) => this.onConverterResolveBegin(c));
        typedoc.converter.on(Converter.EVENT_RESOLVE_END, (c: Context) => this.onConverterResolveEnd(c));

        typedoc.renderer.on(RendererEvent.BEGIN, (e: RendererEvent) => this.onRendererBegin(e));
        typedoc.renderer.on(RendererEvent.END, (e: RendererEvent) => this.onRendererEnd(e));
        typedoc.renderer.on(PageEvent.END, (e: PageEvent) => this.onRendererEndPage(e));
    }

    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * Reads plugin parameter values.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveBegin(context: Context): void {
        this.options.readValuesFromApplication(context.converter.owner.application);
    }

    /**
     * Triggered when the TypeDoc converter has finished resolving a project.
     * Generates the PlantUML code for every class and interface.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveEnd(context: Context): void {
        const project = context.project;

        for (const key in project.reflections) {
            const reflection = project.reflections[key];

            if (reflection && this.shouldCreateClassDiagramForReflection(reflection)) {
                const plantUmlLines = this.getClassDiagramPlantUmlForReflection(reflection);

                if (plantUmlLines.length > 0) {
                    this.reflectionPlantUmlMap.set(reflection.id, plantUmlLines);
                }
            }
        }
    }

    /**
     * Returns if a class diagram should be generated for the given reflection.
     * @param reflection The reflection for which the question is asked.
     * @returns True, if a class diagram should be generated for the given reflection, otherwise false.
     */
    private shouldCreateClassDiagramForReflection(reflection: Reflection): reflection is DeclarationReflection {
        if (
            (this.options.autoClassDiagramType === ClassDiagramType.Simple ||
                this.options.autoClassDiagramType === ClassDiagramType.Detailed) &&
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) &&
            reflection.comment
        ) {
            return true;
        }

        return false;
    }

    /**
     * Generates the Plant UML lines for the class diagram of the given reflection.
     * @param reflection The reflection for which to generate a class diagram.
     * @returns The Plant UML lines for the class diagram of the given reflection.
     *          If the given reflection is not part of an inheritance or implementation, the result is an empty array.
     */
    private getClassDiagramPlantUmlForReflection(reflection: DeclarationReflection): string[] {
        const includeChildren = this.options.autoClassDiagramType === ClassDiagramType.Detailed;

        let plantUmlLines = new Array<string>();
        let siblingsAbove = 0;
        let siblingsBelow = 0;

        // add class/interface
        plantUmlLines = plantUmlLines.concat(PlantUmlUtils.getPlantUmlForReflection(reflection, includeChildren));

        // add classes/interfaces this type is extending
        const extendedTypes = TypeDocUtils.getExtendedTypesForReflection(reflection);

        for (const type of extendedTypes) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|-- " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        const implementedTypes = TypeDocUtils.getImplementedTypesForReflection(reflection);

        for (const type of implementedTypes) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|.. " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        const extendedBys = TypeDocUtils.getExtendedBysForReflection(reflection);

        for (const type of extendedBys) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|-- " + type.name);
            ++siblingsBelow;
        }

        // add classes that are implementing this type
        const implementedBys = TypeDocUtils.getImplementedBysForReflection(reflection);

        for (const type of implementedBys) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.getPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|.. " + type.name);
            ++siblingsBelow;
        }

        // Return no UML if there is no inheritance or implementation involved
        if (siblingsAbove + siblingsBelow === 0) {
            plantUmlLines = [];
        } else {
            if (this.options.autoClassDiagramHideEmptyMembers) {
                plantUmlLines.unshift("hide empty fields");
                plantUmlLines.unshift("hide empty methods");
            }

            if (this.options.autoClassDiagramHideCircledChar) {
                plantUmlLines.unshift("hide circle");
            }

            if (
                siblingsAbove > this.options.autoClassDiagramTopDownLayoutMaxSiblings ||
                siblingsBelow > this.options.autoClassDiagramTopDownLayoutMaxSiblings
            ) {
                plantUmlLines.unshift("left to right direction");
            }

            if (this.options.autoClassDiagramMemberVisibilityStyle === ClassDiagramMemberVisibilityStyle.Text) {
                plantUmlLines.unshift("skinparam ClassAttributeIconSize 0");
            }

            if (this.options.autoClassDiagramHideShadow) {
                plantUmlLines.unshift("skinparam Shadowing false");
            }

            if (this.options.autoClassDiagramBoxBorderRadius) {
                plantUmlLines.unshift("skinparam RoundCorner " + this.options.autoClassDiagramBoxBorderRadius);
            }

            if (this.options.autoClassDiagramBoxBackgroundColor) {
                plantUmlLines.unshift(
                    "skinparam ClassBackgroundColor " + this.options.autoClassDiagramBoxBackgroundColor
                );
            }

            if (this.options.autoClassDiagramBoxBorderColor) {
                plantUmlLines.unshift("skinparam ClassBorderColor " + this.options.autoClassDiagramBoxBorderColor);
            }

            if (this.options.autoClassDiagramBoxBorderWidth >= 0) {
                plantUmlLines.unshift("skinparam ClassBorderThickness " + this.options.autoClassDiagramBoxBorderWidth);
            }

            if (this.options.autoClassDiagramArrowColor) {
                plantUmlLines.unshift("skinparam ClassArrowColor " + this.options.autoClassDiagramArrowColor);
            }

            if (this.options.autoClassDiagramClassFontName) {
                plantUmlLines.unshift("skinparam ClassFontName " + this.options.autoClassDiagramClassFontName);
            }

            if (this.options.autoClassDiagramClassFontSize) {
                plantUmlLines.unshift("skinparam ClassFontSize " + this.options.autoClassDiagramClassFontSize);
            }

            if (this.options.autoClassDiagramClassFontStyle !== FontStyle.Undefined) {
                plantUmlLines.unshift(
                    "skinparam ClassFontStyle " + this.options.autoClassDiagramClassFontStyle.toString()
                );
            }

            if (this.options.autoClassDiagramClassFontColor) {
                plantUmlLines.unshift("skinparam ClassFontColor " + this.options.autoClassDiagramClassFontColor);
            }

            if (this.options.autoClassDiagramClassAttributeFontName) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontName " + this.options.autoClassDiagramClassAttributeFontName
                );
            }

            if (this.options.autoClassDiagramClassAttributeFontSize) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontSize " + this.options.autoClassDiagramClassAttributeFontSize
                );
            }

            if (this.options.autoClassDiagramClassAttributeFontStyle !== FontStyle.Undefined) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontStyle " +
                        this.options.autoClassDiagramClassAttributeFontStyle.toString()
                );
            }

            if (this.options.autoClassDiagramClassAttributeFontColor) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontColor " + this.options.autoClassDiagramClassAttributeFontColor
                );
            }
        }

        return plantUmlLines;
    }

    /**
     * Triggered before the renderer starts rendering a project.
     * @param event The event emitted by the renderer class.
     */
    public onRendererBegin(event: RendererEvent): void {
        this.localImageGenerator.setOutputDirectory(path.join(event.outputDirectory, "assets/images/"));
    }

    /**
     * Triggered after the renderer has written all documents.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEnd(event: RendererEvent): void {
        // append style to main.css
        const filename = path.join(event.outputDirectory, "assets/css/main.css");
        const data = fs.readFileSync(filename, "utf8") + "\n.uml { max-width: 100%; }\n";
        fs.writeFileSync(filename, data, "utf8");
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates local image files and updates the image urls in the comments.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (!event.contents) {
            return;
        }

        const page = new PageProcessor(event.contents);

        if (page.isDetailPage) {
            const reflection = event.model as Reflection;
            const reflectionPlanUmlLines = this.reflectionPlantUmlMap.get(reflection.id);

            if (reflectionPlanUmlLines) {
                const encodedPlantUml = PlantUmlUtils.encode(reflectionPlanUmlLines.join("\n"));
                const imagePath =
                    this.options.outputImageLocation === ImageLocation.Local
                        ? this.localImageGenerator.writeImage(
                              event.filename,
                              encodedPlantUml,
                              this.options.outputImageFormat === ImageFormat.PNG ? "png" : "svg"
                          )
                        : PlantUmlUtils.plantUmlServerUrl +
                          this.options.outputImageFormat.toString() +
                          "/~1" +
                          encodedPlantUml;

                // Add HTML to page

                const umlClassDiagramSection = `<section class="tsd-panel tsd-hierarchy"><h3>Hierarchy-Diagram</h3><img class="uml" src="${imagePath}" alt="UML class diagram of ${reflection.name}" /></section>`;

                if (this.options.autoClassDiagramPosition === ClassDiagramPosition.Above) {
                    page.insertAboveSection(PageSections.Hierarchy, umlClassDiagramSection);
                } else {
                    page.insertBelowSection(PageSections.Hierarchy, umlClassDiagramSection);
                }

                event.contents = page.content;
            }
        }
    }
}
