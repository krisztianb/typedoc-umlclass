import * as fs from "fs";
import * as path from "path";
// @ts-ignore: there are no type definitions for the "plantuml-encoder" module :-(
import plantUmlEncoder = require("plantuml-encoder");
import * as ProgressBar from "progress";
import { Application, DeclarationReflection, ProjectReflection, ReflectionKind } from "typedoc";
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

    /** The directory in which the plugin generates files. */
    private outputDirectory!: string;

    /** Used when the class diagrams are created locally. */
    private imageGenerator = new ImageGenerator();

    /** Object that generates the PlantUML code. */
    private plantUmlCodeGenerator!: CachingPlantUmlCodeGenerator;

    /** Object that generates the PlantUML diagrams. */
    private plantUmlDiagramGenerator = new PlantUmlDiagramGenerator();

    /** Progress bar shown when generating the diagrams. */
    private progressBar!: ProgressBar;

    /**
     * Checks if the plugin is active and should generate output.
     * @returns True if the plugin is active, otherwise false.
     */
    get isActive(): boolean {
        return (
            this.options.classDiagramType === ClassDiagramType.Simple ||
            this.options.classDiagramType === ClassDiagramType.Detailed
        );
    }

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
        typedoc.renderer.on(PageEvent.END, (e: PageEvent) => this.onRendererEndPage(e));
        typedoc.renderer.on(RendererEvent.END, (e: RendererEvent) => this.onRendererEnd(e));
    }

    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * Reads plugin parameter values and init members.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveBegin(context: Context): void {
        this.options.readValuesFromApplication(context.converter.owner.application);

        if (this.isActive) {
            this.plantUmlCodeGenerator = new CachingPlantUmlCodeGenerator(this.options);
        }
    }

    /**
     * Triggered when the TypeDoc converter has finished resolving a project.
     * Setup progress bar.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveEnd(context: Context): void {
        if (this.isActive && !this.options.hideProgressBar) {
            const numberOfDiagramsToGenerate = this.computeDiagramCount(context.project);

            this.progressBar = new ProgressBar(`Adding ${numberOfDiagramsToGenerate} class diagrams [:bar] :percent`, {
                total: numberOfDiagramsToGenerate,
                width: 40,
            });
        }
    }

    /**
     * Computes how many diagrams the plugin must generate.
     * @param project The project containing the reflections for which the diagrams are generated.
     * @returns The number of diagrams to generate.
     */
    private computeDiagramCount(project: ProjectReflection): number {
        let count = 0;

        for (const key in project.reflections) {
            const reflection = project.reflections[key];

            if (reflection && this.shouldProcessReflection(reflection)) {
                ++count;
            }
        }

        return count;
    }

    /**
     * Triggered before the renderer starts rendering a project.
     * Setup image generator output directory and progress bar.
     * @param event The event emitted by the renderer class.
     */
    public onRendererBegin(event: RendererEvent): void {
        if (this.isActive) {
            this.outputDirectory = path.join(event.outputDirectory, "assets/images/");
            this.imageGenerator.setOutputDirectory(this.outputDirectory);
        }
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates a UML class diagram and adds it to the page of the reflection.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (this.isActive && this.shouldProcessPage(event.contents, event.model)) {
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
        if (
            pageContent &&
            this.shouldProcessReflection(pageModel) &&
            PageSectionFinder.hasSection(pageContent, PageSections.Hierarchy)
        ) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the plugin should process a given reflection.
     * @param reflection The reflection in question.
     * @returns True, if the plugin should process the reflection, otherwise false.
     */
    private shouldProcessReflection(reflection: unknown): boolean {
        if (
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) &&
            TypeDocUtils.reflectionIsPartOfClassHierarchy(reflection)
        ) {
            return true;
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

        if (this.options.createPlantUmlFiles) {
            const filename = reflection.name + "-umlClassDiagram-" + reflection.id + ".puml";
            this.createPlantUmlFile(path.join(this.outputDirectory, filename), plantUmlLines);
        }

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
                this.progressBar?.tick();
            })
            .catch((e: Error) => {
                console.error("Error adding diagram into file", event.filename, e.message);
            });
    }

    /**
     * Creates a file containing the PlantUML code.
     * @param filePath Absolute path to the file to generate.
     * @param plantUmlLines The PlantUML code that should be written into the file.
     */
    private createPlantUmlFile(filePath: string, plantUmlLines: string[]): void {
        const fileContent = ["@startuml", ...plantUmlLines, "@enduml"];
        fs.writeFileSync(filePath, fileContent.join("\n"), "utf8");
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
            this.options.sectionTitle,
            imageUrl,
            reflectionName
        );

        if (this.options.classDiagramPosition === ClassDiagramPosition.Above) {
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
        if (this.isActive) {
            const filename = path.join(event.outputDirectory, "assets/css/main.css");
            const data =
                fs.readFileSync(filename, "utf8") +
                "\n.uml-class { max-width:100%; display:block; margin:0 auto; text-align:center }\n";
            fs.writeFileSync(filename, data, "utf8");
        }
    }
}
