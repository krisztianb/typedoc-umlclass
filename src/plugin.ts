import * as fs from "fs";
import * as path from "path";
import { Application, DeclarationReflection, Reflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { ImageGenerator } from "./image_generator";
import { PageProcessor, PageSections } from "./page_processor";
import { PlantUmlUtils } from "./plantuml_utils";
import {
    ClassDiagramMemberVisibilityStyle,
    ClassDiagramPosition,
    ClassDiagramType,
    FontStyle,
    ImageLocation,
    PluginOptions,
} from "./plugin_options";
import { TypeDocUtils } from "./typedoc_utils";

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

        typedoc.renderer.on(RendererEvent.BEGIN, (e: RendererEvent) => this.onRendererBegin(e));
        typedoc.renderer.on(PageEvent.END, (e: PageEvent) => this.onRendererEndPage(e));
        typedoc.renderer.on(RendererEvent.END, (e: RendererEvent) => this.onRendererEnd(e));
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
     * Returns if a class diagram should be generated for the given reflection.
     * @param reflection The reflection for which the question is asked.
     * @returns True, if a class diagram should be generated for the given reflection, otherwise false.
     */
    private shouldCreateClassDiagramForReflection(reflection: Reflection): reflection is DeclarationReflection {
        if (
            (this.options.umlClassDiagramType === ClassDiagramType.Simple ||
                this.options.umlClassDiagramType === ClassDiagramType.Detailed) &&
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) &&
            TypeDocUtils.reflectionIsPartOfClassHierarchy(reflection)
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
    private createClassDiagramPlantUmlForReflection(reflection: DeclarationReflection): string[] {
        const includeChildren = this.options.umlClassDiagramType === ClassDiagramType.Detailed;

        let plantUmlLines = new Array<string>();
        let siblingsAbove = 0;
        let siblingsBelow = 0;

        // add class/interface
        plantUmlLines = plantUmlLines.concat(PlantUmlUtils.createPlantUmlForReflection(reflection, includeChildren));

        // add classes/interfaces this type is extending
        const extendedTypes = TypeDocUtils.getExtendedTypesForReflection(reflection);

        for (const type of extendedTypes) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.createPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|-- " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces this type is implementing
        const implementedTypes = TypeDocUtils.getImplementedTypesForReflection(reflection);

        for (const type of implementedTypes) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.createPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(type.name + " <|.. " + reflection.name);
            ++siblingsAbove;
        }

        // add classes/interfaces that are extending this type
        const extendedBys = TypeDocUtils.getExtendedBysForReflection(reflection);

        for (const type of extendedBys) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.createPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|-- " + type.name);
            ++siblingsBelow;
        }

        // add classes that are implementing this type
        const implementedBys = TypeDocUtils.getImplementedBysForReflection(reflection);

        for (const type of implementedBys) {
            plantUmlLines = plantUmlLines.concat(PlantUmlUtils.createPlantUmlForReflection(type, includeChildren));
            plantUmlLines.push(reflection.name + " <|.. " + type.name);
            ++siblingsBelow;
        }

        // Return no UML if there is no inheritance or implementation involved
        if (siblingsAbove + siblingsBelow === 0) {
            plantUmlLines = [];
        } else {
            if (this.options.umlClassDiagramHideEmptyMembers) {
                plantUmlLines.unshift("hide empty fields");
                plantUmlLines.unshift("hide empty methods");
            }

            if (this.options.umlClassDiagramHideCircledChar) {
                plantUmlLines.unshift("hide circle");
            }

            if (
                siblingsAbove > this.options.umlClassDiagramTopDownLayoutMaxSiblings ||
                siblingsBelow > this.options.umlClassDiagramTopDownLayoutMaxSiblings
            ) {
                plantUmlLines.unshift("left to right direction");
            }

            if (this.options.umlClassDiagramMemberVisibilityStyle === ClassDiagramMemberVisibilityStyle.Text) {
                plantUmlLines.unshift("skinparam ClassAttributeIconSize 0");
            }

            if (this.options.umlClassDiagramHideShadow) {
                plantUmlLines.unshift("skinparam Shadowing false");
            }

            if (this.options.umlClassDiagramBoxBorderRadius) {
                plantUmlLines.unshift("skinparam RoundCorner " + this.options.umlClassDiagramBoxBorderRadius);
            }

            if (this.options.umlClassDiagramBoxBackgroundColor) {
                plantUmlLines.unshift(
                    "skinparam ClassBackgroundColor " + this.options.umlClassDiagramBoxBackgroundColor
                );
            }

            if (this.options.umlClassDiagramBoxBorderColor) {
                plantUmlLines.unshift("skinparam ClassBorderColor " + this.options.umlClassDiagramBoxBorderColor);
            }

            if (this.options.umlClassDiagramBoxBorderWidth >= 0) {
                plantUmlLines.unshift("skinparam ClassBorderThickness " + this.options.umlClassDiagramBoxBorderWidth);
            }

            if (this.options.umlClassDiagramArrowColor) {
                plantUmlLines.unshift("skinparam ClassArrowColor " + this.options.umlClassDiagramArrowColor);
            }

            if (this.options.umlClassDiagramClassFontName) {
                plantUmlLines.unshift("skinparam ClassFontName " + this.options.umlClassDiagramClassFontName);
            }

            if (this.options.umlClassDiagramClassFontSize) {
                plantUmlLines.unshift("skinparam ClassFontSize " + this.options.umlClassDiagramClassFontSize);
            }

            if (this.options.umlClassDiagramClassFontStyle !== FontStyle.Undefined) {
                plantUmlLines.unshift(
                    "skinparam ClassFontStyle " + this.options.umlClassDiagramClassFontStyle.toString()
                );
            }

            if (this.options.umlClassDiagramClassFontColor) {
                plantUmlLines.unshift("skinparam ClassFontColor " + this.options.umlClassDiagramClassFontColor);
            }

            if (this.options.umlClassDiagramClassAttributeFontName) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontName " + this.options.umlClassDiagramClassAttributeFontName
                );
            }

            if (this.options.umlClassDiagramClassAttributeFontSize) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontSize " + this.options.umlClassDiagramClassAttributeFontSize
                );
            }

            if (this.options.umlClassDiagramClassAttributeFontStyle !== FontStyle.Undefined) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontStyle " +
                        this.options.umlClassDiagramClassAttributeFontStyle.toString()
                );
            }

            if (this.options.umlClassDiagramClassAttributeFontColor) {
                plantUmlLines.unshift(
                    "skinparam ClassAttributeFontColor " + this.options.umlClassDiagramClassAttributeFontColor
                );
            }
        }

        return plantUmlLines;
    }

    /**
     * Triggered before the renderer starts rendering a project.
     * Setup image generator output directory and progress bar.
     * @param event The event emitted by the renderer class.
     */
    public onRendererBegin(event: RendererEvent): void {
        this.localImageGenerator.setOutputDirectory(path.join(event.outputDirectory, "assets/images/"));
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates a UML class diagram and adds it to the page of the reflection.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (!event.contents) {
            return;
        }

        const page = new PageProcessor(event.contents);
        if (!page.isDetailPage) {
            return;
        }

        const reflection = event.model as DeclarationReflection;
        const plantUmlLines = this.shouldCreateClassDiagramForReflection(reflection)
            ? this.createClassDiagramPlantUmlForReflection(reflection)
            : [];
        if (plantUmlLines.length === 0) {
            return;
        }

        const encodedPlantUml = PlantUmlUtils.encode(plantUmlLines.join("\n"));
        const imagePath =
            this.options.outputImageLocation === ImageLocation.Local
                ? this.localImageGenerator.writeImage(event.filename, encodedPlantUml, this.options.outputImageFormat)
                : PlantUmlUtils.createPlantUmlServerUrl(encodedPlantUml, this.options.outputImageFormat);

        const hierarchyDiagramSection = this.createHierarchyDiagramSection(imagePath, reflection.name);

        if (this.options.umlClassDiagramPosition === ClassDiagramPosition.Above) {
            page.insertAboveSection(PageSections.Hierarchy, hierarchyDiagramSection);
        } else {
            page.insertBelowSection(PageSections.Hierarchy, hierarchyDiagramSection);
        }

        event.contents = page.content;
    }

    /**
     * Creates HTML for a section containing a hierarchy diagram.
     * @param imagePath The hierarchy diagram as an image.
     * @param reflectionName The name of the reflection for which the hierarchy diagram was generated.
     * @returns The HTML for the section.
     */
    private createHierarchyDiagramSection(imagePath: string, reflectionName: string): string {
        return `<section class="tsd-panel tsd-hierarchy">
                    <h3>${this.options.umlClassDiagramSectionTitle}</h3>
                        <a class="uml-class" href="${imagePath}" title="Click to enlarge">
                            <img src="${imagePath}"
                                 alt="UML class diagram of ${reflectionName}" />
                        </a>
                </section>`;
    }

    /**
     * Triggered after the renderer has written all documents.
     * Appends style data to the main CSS file.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEnd(event: RendererEvent): void {
        const filename = path.join(event.outputDirectory, "assets/css/main.css");
        const data =
            fs.readFileSync(filename, "utf8") +
            "\n.uml-class { max-width:100%; display:block; margin:0 auto; text-align:center }\n";
        fs.writeFileSync(filename, data, "utf8");
    }
}
