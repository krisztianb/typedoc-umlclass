import * as fs from "fs";
import * as path from "path";
// @ts-ignore: there are no type definitions for the "plantuml-encoder" module :-(
import plantUmlEncoder = require("plantuml-encoder");
import { Application, DeclarationReflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { ClassDiagramType } from "./enumerations";
import { ImageGenerator } from "./image_generator";
import { CachingPlantUmlCodeGenerator } from "./plantuml/caching_plantuml_code_generator";
import { PlantUmlDiagramGenerator } from "./plantuml/plantuml_diagram_generator";
import { ClassDiagramPosition, ImageFormat, ImageLocation, PluginOptions } from "./plugin_options";
import { PageProcessor } from "./typedoc/page_processor";
import { PageSection, PageSections } from "./typedoc/page_section";
import { PageSectionFinder } from "./typedoc/page_section_finder";
import { TypeDocUtils } from "./typedoc/typedoc_utils";

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
    private imageGenerator = new ImageGenerator();

    /** Object that generates the PlantUML code. */
    private plantUmlCodeGenerator!: CachingPlantUmlCodeGenerator;

    /** Object that generates the PlantUML diagrams. */
    private plantUmlDiagramGenerator = new PlantUmlDiagramGenerator();

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

        this.plantUmlCodeGenerator = new CachingPlantUmlCodeGenerator(this.options);
    }

    /**
     * Triggered before the renderer starts rendering a project.
     * Setup image generator output directory and progress bar.
     * @param event The event emitted by the renderer class.
     */
    public onRendererBegin(event: RendererEvent): void {
        this.imageGenerator.setOutputDirectory(path.join(event.outputDirectory, "assets/images/"));
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates a UML class diagram and adds it to the page of the reflection.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (this.shouldProcessPage(event.contents, event.model)) {
            this.processPage(event);
        }
    }

    /**
     * Checks if the plugin should process a given page.
     * @param pageContent The content of the page.
     * @param pageModel The model for the page.
     * @returns True, if the plugin should process the page, otherwise false.
     */
    private shouldProcessPage(pageContent: string | undefined, pageModel: unknown): boolean {
        const isPluginActive =
            this.options.umlClassDiagramType === ClassDiagramType.Simple ||
            this.options.umlClassDiagramType === ClassDiagramType.Detailed;

        if (isPluginActive && pageContent) {
            const modelIsClassOrInterface =
                pageModel instanceof DeclarationReflection &&
                (pageModel.kind === ReflectionKind.Class || pageModel.kind === ReflectionKind.Interface);

            if (modelIsClassOrInterface) {
                const reflection = pageModel as DeclarationReflection;

                if (
                    TypeDocUtils.reflectionIsPartOfClassHierarchy(reflection) &&
                    PageSectionFinder.hasSection(pageContent, PageSections.Hierarchy)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Processes the page by inserting a hierarchy diagram into it.
     * @param event The page event with the page data.
     */
    private processPage(event: PageEvent): void {
        const reflection = event.model as DeclarationReflection;
        const plantUmlLines = this.plantUmlCodeGenerator.createClassDiagramPlantUmlForReflection(reflection);

        let imageUrlPromise: Promise<string>;

        if (this.options.outputImageLocation === ImageLocation.Local) {
            imageUrlPromise = this.plantUmlDiagramGenerator
                .generateFromCode(plantUmlLines.join("\n"), this.options.outputImageFormat)
                .then((result: Buffer) => {
                    const absoluteImagePath = this.imageGenerator.writeImageToFile(
                        result,
                        reflection.name,
                        this.options.outputImageFormat
                    );
                    return path.relative(path.dirname(event.filename), absoluteImagePath);
                });
        } else if (this.options.outputImageLocation === ImageLocation.Embed) {
            imageUrlPromise = this.plantUmlDiagramGenerator
                .generateFromCode(plantUmlLines.join("\n"), this.options.outputImageFormat)
                .then((result: Buffer) => {
                    const mimeType = this.options.outputImageFormat === ImageFormat.PNG ? "image/png" : "image/svg+xml";
                    return "data:" + mimeType + ";base64," + result.toString("base64");
                });
        } else {
            imageUrlPromise = new Promise<string>((resolve) => {
                const encodedPlantUml = plantUmlEncoder.encode(plantUmlLines.join("\n"));
                resolve(this.imageGenerator.createPlantUmlServerUrl(encodedPlantUml, this.options.outputImageFormat));
            });
        }

        imageUrlPromise
            .then((imageUrl: string) => {
                this.insertHierarchyDiagramIntoFile(event.filename, reflection.name, imageUrl);
            })
            .catch((e: Error) => {
                console.error("Error adding diagram into file", event.filename, e.message);
            });
    }

    /**
     * Inserts the hierarchy diagram into the page file.
     * @param filePath Absolute path to the page file.
     * @param reflectionName The name of the reflection for which the diagram was generated.
     * @param imageUrl The URL to the image of the diagram.
     */
    private insertHierarchyDiagramIntoFile(filePath: string, reflectionName: string, imageUrl: string): void {
        let fileContent = fs.readFileSync(filePath, "utf8");

        fileContent = this.insertHierarchyDiagramIntoContent(fileContent, reflectionName, imageUrl);
        fs.writeFileSync(filePath, fileContent, "utf8");
    }

    /**
     * Inserts the hierarchy diagram into the content string.
     * @param originalContent The content string into which the diagram is inserted.
     * @param reflectionName The name of the reflection for which the diagram was generated.
     * @param imageUrl The URL to the image of the diagram.
     * @returns The updated content string with the diagram inserted into it.
     */
    private insertHierarchyDiagramIntoContent(
        originalContent: string,
        reflectionName: string,
        imageUrl: string
    ): string {
        const page = new PageProcessor(originalContent);

        const hierarchyDiagramSection = PageSection.createForHierarchyDiagram(
            this.options.umlClassDiagramSectionTitle,
            imageUrl,
            reflectionName
        );

        if (this.options.umlClassDiagramPosition === ClassDiagramPosition.Above) {
            page.insertAboveSection(PageSections.Hierarchy, hierarchyDiagramSection);
        } else {
            page.insertBelowSection(PageSections.Hierarchy, hierarchyDiagramSection);
        }

        return page.content;
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
