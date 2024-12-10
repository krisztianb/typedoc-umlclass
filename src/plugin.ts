import * as fs from "fs";
import * as path from "path";
import ProgressBar from "progress";
import {
    type Application,
    type Context,
    Converter,
    DeclarationReflection,
    PageEvent,
    type ProjectReflection,
    ReflectionKind,
    RendererEvent,
} from "typedoc";
import { createDiagramLegendForPlantUml, DiagramLegend } from "./diagram_legend.js";
import { createEmbeddedImageUrl, createLocalImageFileUrl, createRemoteImageUrl } from "./image_url_generator.js";
import { Logger } from "./logger.js";
import { CachingPlantUmlCodeGenerator } from "./plantuml/caching_plantuml_code_generator.js";
import { type PlantUmlCodeGenerator, type PlantUmlCodeGeneratorOptions } from "./plantuml/plantuml_code_generator.js";
import { PlantUmlDiagramGenerator } from "./plantuml/plantuml_diagram_generator.js";
import { PluginOptions } from "./plugin_options.js";
import { PageProcessor } from "./typedoc/page_processor.js";
import { createHierarchyDiagramSection, PageSections } from "./typedoc/page_section.js";
import { PageSectionFinder } from "./typedoc/page_section_finder.js";
import { reflectionIsPartOfClassHierarchy } from "./typedoc/typedoc_utils.js";

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
 * 2. The plugin uses the plantuml-pipe module to generate image files from the PlantUML code.
 * 3. The plugin adds a section with the image to the page of each class and interface.
 */
export class Plugin {
    /** The TypeDoc application instance that loaded the plugin. */
    private typedoc!: Application;

    /** The options of this plugin. */
    private readonly options = new PluginOptions();

    /** The directory in which the plugin generates files. */
    private outputDirectory!: string;

    /** Stores how many diagrams the plugin has to generate. */
    private numberOfDiagramsToGenerate = 0;

    /** Object that uses TypeDoc reflection data to generate PlantUML code. */
    private plantUmlCodeGenerator!: PlantUmlCodeGenerator;

    /** Object that uses PlantUML code to generate PlantUML diagrams. */
    private plantUmlDiagramGenerator!: PlantUmlDiagramGenerator | undefined;

    /** Progress bar shown when generating the diagrams. */
    private progressBar: ProgressBar | undefined;

    /** Logger for verbose output in debug mode. */
    private log: Logger | undefined;

    /** Stores the legends for the diagram of every reflection (KEY = ID of the reflection). */
    private readonly diagramLegends = new Map<number, DiagramLegend>();

    /**
     * Checks if the plugin is active and should generate output.
     * @returns True if the plugin is active, otherwise false.
     */
    public get isActive(): boolean {
        return this.options.type === "simple" || this.options.type === "detailed";
    }

    /**
     * Checks if the plugin has anything to do.
     * @returns True if the plugin needs to generate diagrams, otherwise false.
     */
    public get hasWork(): boolean {
        return this.numberOfDiagramsToGenerate > 0;
    }

    /**
     * Checks if the plugin is generating images from the generated PlantUML code.
     * @returns True if the plugin is generating images, otherwise false.
     */
    public get isGeneratingImages(): boolean {
        return this.options.location === "local" || this.options.location === "embed";
    }

    /**
     * Checks if the plugin should generate diagram legends.
     * @returns True if the plugin should generate diagram legends, otherwise false.
     */
    public get shouldGenerateLegends(): boolean {
        // The simple diagram type can only contain the circled chars.
        // If those are deactivated then it does not make sense to have any legends.
        if (this.options.type === "simple" && this.options.hideCircledChar) {
            return false;
        } else if (this.options.legendType === "only-included" || this.options.legendType === "full") {
            return true;
        }

        return false;
    }

    /**
     * Initializes the plugin.
     * @param typedoc The TypeDoc application.
     */
    public initialize(typedoc: Application): void {
        this.typedoc = typedoc;

        this.addOptionsToApplication();
        this.subscribeToApplicationEvents();
    }

    /**
     * Triggered when the TypeDoc converter begins resolving a project.
     * Reads plugin parameter values.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveBegin(context: Context): void {
        this.options.readValuesFromApplication(context.converter.owner);
    }

    /**
     * Triggered when the TypeDoc converter has finished resolving a project.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveEnd(context: Context): void {
        if (this.isActive) {
            if (this.options.createVerboseOutput) {
                this.log = new Logger();
            }

            this.log?.info("Caculating number of diagrams to generate ...");
            this.numberOfDiagramsToGenerate = this.computeDiagramCount(context.project);
            this.log?.info("The result is: " + this.numberOfDiagramsToGenerate.toString());

            if (this.hasWork) {
                this.plantUmlCodeGenerator = new CachingPlantUmlCodeGenerator(
                    this.createPlantUmlCodeGeneratorOptions(),
                );

                if (this.isGeneratingImages) {
                    this.plantUmlDiagramGenerator = new PlantUmlDiagramGenerator(
                        this.options.generatorProcessCount,
                        this.options.format,
                    );

                    if (!this.options.hideProgressBar) {
                        this.log?.info("Setting up progress bar ...");
                        this.progressBar = new ProgressBar(
                            `Using ${this.options.generatorProcessCount} process(es) to add ${this.numberOfDiagramsToGenerate} class diagrams [:bar] :percent`,
                            {
                                total: this.numberOfDiagramsToGenerate,
                                width: 40,
                            },
                        );
                    }
                }
            }
        }
    }

    /**
     * Triggered before the renderer starts rendering a project.
     * Setup image generator output directory and progress bar.
     * @param event The event emitted by the renderer class.
     */
    public onRendererBegin(event: RendererEvent): void {
        if (this.isActive && this.hasWork) {
            this.outputDirectory = path.join(event.outputDirectory, "assets/");
        }
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates a UML class diagram and adds it to the page of the reflection.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (this.isActive && this.hasWork) {
            if (this.shouldProcessReflection(event.model)) {
                if (this.shouldProcessPage(event.contents)) {
                    this.log?.info(`Processing page for reflection ${event.model.name} ...`);
                    this.processPage(event);
                } else {
                    this.log?.info(`Skipping page for reflection ${event.model.name} ...`);
                }
            }
        }
    }

    /**
     * Triggered after the renderer has written all documents.
     * Appends style data to the main CSS file.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEnd(event: RendererEvent): void {
        if (this.isActive && this.hasWork) {
            this.log?.info("Attaching content to CSS file ...");

            const filename = path.join(event.outputDirectory, "assets/style.css");

            let data =
                fs.readFileSync(filename, "utf8") +
                "\n.tsd-hierarchy-diagram .diagram { max-width: 100%; display: block; margin: 0 auto; text-align: center; }\n";

            if (this.shouldGenerateLegends) {
                data += DiagramLegend.getCss();
            }

            fs.writeFileSync(filename, data, "utf8");

            this.log?.info("DONE");

            if (this.isGeneratingImages && this.plantUmlDiagramGenerator) {
                this.plantUmlDiagramGenerator.shutdown();
            }
        }
    }

    /**
     * Adds the plugin's options to the application's options.
     */
    private addOptionsToApplication(): void {
        this.options.addToApplication(this.typedoc);
    }

    /**
     * Subscribes to events of the application so that the plugin can do its work
     * in the particular doc generation phases.
     */
    private subscribeToApplicationEvents(): void {
        this.typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Context) => this.onConverterResolveBegin(c));
        this.typedoc.converter.on(Converter.EVENT_RESOLVE_END, (c: Context) => this.onConverterResolveEnd(c));

        this.typedoc.renderer.on(RendererEvent.BEGIN, (e: RendererEvent) => this.onRendererBegin(e));
        this.typedoc.renderer.on(PageEvent.END, (e: PageEvent) => this.onRendererEndPage(e));
        this.typedoc.renderer.on(RendererEvent.END, (e: RendererEvent) => this.onRendererEnd(e));
    }

    /**
     * Creates the PlantUML code generator options using the current plugin options.
     * @returns The options for the PlantUML code generator.
     */
    private createPlantUmlCodeGeneratorOptions(): PlantUmlCodeGeneratorOptions {
        return {
            type: this.options.type,
            methodParameterOutput: this.options.methodParameterOutput,
            memberOrder: this.options.memberOrder,
            topDownLayoutMaxSiblings: this.options.topDownLayoutMaxSiblings,
            visibilityStyle: this.options.visibilityStyle,
            hideEmptyMembers: this.options.hideEmptyMembers,
            hideCircledChar: this.options.hideCircledChar,
            hideShadow: this.options.hideShadow,
            diagramBackgroundColor: this.options.backgroundColor,
            boxBackgroundColor: this.options.box.backgroundColor,
            boxBorderWidth: this.options.box.border.width,
            boxBorderColor: this.options.box.border.color,
            boxBorderRadius: this.options.box.border.radius,
            arrowWidth: this.options.arrow.width,
            arrowColor: this.options.arrow.color,
            className: this.options.class.name,
            interfaceName: this.options.interface.name,
            propertyName: this.options.property.name,
            propertyType: this.options.property.type,
            methodName: this.options.method.name,
            methodParameterName: this.options.method.parameter.name,
            methodParameterType: this.options.method.parameter.type,
            methodReturnType: this.options.method.returnType,
        };
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

            if (this.shouldProcessReflection(reflection)) {
                ++count;
            }
        }

        return count;
    }

    /**
     * Checks if the plugin should process a given reflection.
     * @param reflection The reflection in question.
     * @returns True, if the plugin should process the reflection, otherwise false.
     */
    // eslint-disable-next-line class-methods-use-this
    private shouldProcessReflection(reflection: unknown): reflection is DeclarationReflection {
        if (
            reflection instanceof DeclarationReflection &&
            (reflection.kind === ReflectionKind.Class || reflection.kind === ReflectionKind.Interface) &&
            reflectionIsPartOfClassHierarchy(reflection)
        ) {
            return true;
        }

        return false;
    }

    /**
     * Checks if the plugin should process a given page.
     * @param pageContent The content of the page.
     * @returns True, if the plugin should process the page, otherwise false.
     */
    // eslint-disable-next-line class-methods-use-this
    private shouldProcessPage(pageContent?: string): boolean {
        if (pageContent && PageSectionFinder.hasSection(pageContent, PageSections.Hierarchy)) {
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

        this.log?.info(`Generating PlantUML code for reflection ${reflection.name} ...`);
        const plantUmlLines = this.plantUmlCodeGenerator.createClassDiagramPlantUmlForReflection(reflection);
        const plantUml = plantUmlLines.join("\n");

        if (this.options.createPlantUmlFiles) {
            this.log?.info(`Writing PlantUML file for reflection ${reflection.name} ...`);
            this.writePlantUmlFileForReflection(plantUml, reflection);
        }

        if (this.shouldGenerateLegends) {
            this.log?.info(`Creating leged for diagram of reflection ${reflection.name} ...`);
            this.createLegendForReflection(reflection, plantUmlLines);
        }

        if (this.isGeneratingImages && this.plantUmlDiagramGenerator) {
            this.log?.info(`Creating diagram image for reflection ${reflection.name} ...`);

            const job = this.plantUmlDiagramGenerator.generate(plantUml + "\n").then((imageData) => {
                this.processImageData(reflection, event.filename, imageData);
            });

            // Notify TypeDoc of the async job so that it can await it before shutting itself down.
            // Without this the generator processes are killed when the TypeDoc process ends.
            this.typedoc.renderer.postRenderAsyncJobs.push(async () => job);
        } else if (this.options.location === "remote") {
            this.log?.info(`Creating remote image URL for reflection ${reflection.name} ...`);
            const imageUrl = createRemoteImageUrl(this.options.remoteBaseUrl, plantUml, this.options.format);

            this.log?.info(`Inserting diagram into page of reflection ${reflection.name} ...`);
            event.contents = this.insertHierarchyDiagramIntoContent(event.contents as string, reflection, imageUrl);
        }
    }

    /**
     * Processes the image data of a generated diagram by creating an image URL and adding it to the reflection's page.
     * @param reflection The reflection for which the image was generated.
     * @param pageFilePath Path to the output file of the reflection's doc page.
     * @param imageData The data of the generated image.
     */
    private readonly processImageData = (
        reflection: DeclarationReflection,
        pageFilePath: string,
        imageData: Readonly<Buffer>,
    ): void => {
        let imageUrl = "";

        if (this.options.location === "local") {
            this.log?.info(`Writing local image file for reflection ${reflection.name} ...`);
            const absoluteImageFilePath = this.writeLocalImageFileForReflection(imageData, reflection);

            this.log?.info(`Creating local image URL for reflection ${reflection.name} ...`);
            imageUrl = createLocalImageFileUrl(pageFilePath, absoluteImageFilePath);
        } else {
            this.log?.info(`Creating embedded image URL for reflection ${reflection.name} ...`);
            imageUrl = createEmbeddedImageUrl(imageData, this.options.format);
        }

        this.log?.info(`Inserting diagram into page for reflection ${reflection.name} ...`);
        this.insertHierarchyDiagramIntoFile(pageFilePath, reflection, imageUrl);

        this.progressBar?.tick();
    };

    /**
     * Creates a local file with the class diagram of a reflection.
     * @param imageData The image data of the class diagram.
     * @param reflection The reflection for which the file is written.
     * @returns The absolute path to the file that was created.
     */
    private writeLocalImageFileForReflection(imageData: Readonly<Buffer>, reflection: DeclarationReflection): string {
        const filename = `${reflection.name}-umlClassDiagram-${reflection.id}.${this.options.format}`;
        const absoluteFilePath = path.join(this.outputDirectory, filename);

        fs.writeFileSync(absoluteFilePath, imageData as Buffer);
        return absoluteFilePath;
    }

    /**
     * Creates a file containing the PlantUML code.
     * @param plantUml The PlantUML code that should be written into the file.
     * @param reflection The reflection for which the file is written.
     */
    private writePlantUmlFileForReflection(plantUml: string, reflection: DeclarationReflection): void {
        const filename = `${reflection.name}-umlClassDiagram-${reflection.id}.puml`;
        const absoluteFilePath = path.join(this.outputDirectory, filename);

        fs.writeFileSync(absoluteFilePath, plantUml, "utf8");
    }

    /**
     * Creates a legend for the reflection and stores it in the internal map.
     * @param reflection The reflection for which the legend should be generated.
     * @param plantUmlLines The PlantUML lines for the reflection's diagram.
     */
    private createLegendForReflection(reflection: DeclarationReflection, plantUmlLines: string[]): void {
        const legend =
            this.options.legendType === "only-included"
                ? createDiagramLegendForPlantUml(plantUmlLines)
                : new DiagramLegend();

        if (this.options.hideCircledChar) {
            legend.hideTypeIcons();
        }

        if (this.options.isAnythingStyledItalic) {
            // PlantUML uses an italic font for abstract members. If the user specified an italic font for anything
            // then this is no longer reasonable and we hide this entry in the legend to avoid confusion.
            legend.hideAbstractMemberItem();
        }

        this.diagramLegends.set(reflection.id, legend);
    }

    /**
     * Inserts the hierarchy diagram into the page file.
     * @param filePath Absolute path to the page file.
     * @param reflection The reflection for which the diagram was generated.
     * @param imageUrl The URL to the image of the diagram.
     */
    private insertHierarchyDiagramIntoFile(
        filePath: string,
        reflection: DeclarationReflection,
        imageUrl: string,
    ): void {
        let fileContent = fs.readFileSync(filePath, "utf8");

        fileContent = this.insertHierarchyDiagramIntoContent(fileContent, reflection, imageUrl);
        fs.writeFileSync(filePath, fileContent, "utf8");
    }

    /**
     * Inserts the hierarchy diagram into the content string.
     * @param originalContent The content string into which the diagram is inserted.
     * @param reflection The reflection for which the diagram was generated.
     * @param imageUrl The URL to the image of the diagram.
     * @returns The updated content string with the diagram inserted into it.
     */
    private insertHierarchyDiagramIntoContent(
        originalContent: string,
        reflection: DeclarationReflection,
        imageUrl: string,
    ): string {
        const page = new PageProcessor(originalContent);

        const legend = this.diagramLegends.get(reflection.id);

        const hierarchyDiagramSection = createHierarchyDiagramSection(
            this.options.sectionTitle,
            imageUrl,
            reflection.name,
            legend && !legend.isEmpty ? legend.getHtml(this.options.visibilityStyle) : "",
        );

        if (this.options.position === "above") {
            page.insertAboveSection(PageSections.Hierarchy, hierarchyDiagramSection);
        } else {
            page.insertBelowSection(PageSections.Hierarchy, hierarchyDiagramSection);
        }

        return page.content;
    }
}
