import * as fs from "fs";
import * as path from "path";
import * as ProgressBar from "progress";
import { Application, DeclarationReflection, ProjectReflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { ClassDiagramType, LegendType } from "./enumerations";
import { ImageUrlGenerator } from "./image_url_generator";
import { DiagramLegend } from "./legends/diagram_legend";
import { DiagramLegendGenerator } from "./legends/diagram_lenged_generator";
import { Logger } from "./logger";
import { CachingPlantUmlCodeGenerator } from "./plantuml/caching_plantuml_code_generator";
import { PlantUmlDiagramGenerator } from "./plantuml/plantuml_diagram_generator";
import { ClassDiagramPosition, ImageLocation, PluginOptions } from "./plugin_options";
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

    /** Object that uses TypeDoc reflection data to generate PlantUML code. */
    private plantUmlCodeGenerator!: CachingPlantUmlCodeGenerator;

    /** Object that uses PlantUML code to generate PlantUML diagrams. */
    private plantUmlDiagramGenerator = new PlantUmlDiagramGenerator();

    /** Objet that generates URLs for PlantUML diagrams.  */
    private imageUrlGenerator = new ImageUrlGenerator();

    /** Progress bar shown when generating the diagrams. */
    private progressBar: ProgressBar | undefined;

    /** Logger for verbose output in debug mode. */
    private log: Logger | undefined;

    /** Stores the legends for the diagram of every reflection. (KEY = ID of the reflection) */
    private diagramLegends = new Map<number, DiagramLegend>();

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
     * Checks if the plugin should generate diagram legends.
     * @returns True if the plugin should generate diagram legends, otherwise false.
     */
    get shouldGenerateLegends(): boolean {
        // The simple diagram type can only contain the circled chars.
        // If those are deactivated then it does not make sense to have any legends.
        if (this.options.classDiagramType === ClassDiagramType.Simple && this.options.classDiagramHideCircledChar) {
            return false;
        } else if (this.options.legendType === LegendType.OnlyIncluded || this.options.legendType === LegendType.Full) {
            return true;
        } else {
            return false;
        }
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

            if (this.options.createVerboseOutput) {
                this.log = new Logger();
            }
        }
    }

    /**
     * Triggered when the TypeDoc converter has finished resolving a project.
     * Setup progress bar.
     * @param context Describes the current state the converter is in.
     */
    public onConverterResolveEnd(context: Context): void {
        if (this.isActive && !this.options.hideProgressBar) {
            this.log?.info("Caculating number of diagrams to generate ...");
            const numberOfDiagramsToGenerate = this.computeDiagramCount(context.project);

            this.log?.info("Setting up progress bar ...");
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
        }
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     * Generates a UML class diagram and adds it to the page of the reflection.
     * @param event The event emitted by the renderer class.
     */
    public onRendererEndPage(event: PageEvent): void {
        if (this.isActive && this.shouldProcessPage(event.contents, event.model)) {
            this.log?.info(`Processing page for reflection ${event.model?.name} ...`);
            this.processPage(event);
        } else {
            this.log?.info(`Skipping page for reflection ${event.model?.name} ...`);
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

        this.log?.info(`Generating PlantUML code for reflection ${reflection.name} ...`);
        const plantUmlLines = this.plantUmlCodeGenerator.createClassDiagramPlantUmlForReflection(reflection);
        const plantUml = plantUmlLines.join("\n");

        if (this.options.createPlantUmlFiles) {
            this.log?.info(`Writing PlantUML file for reflection ${reflection.name} ...`);
            this.writePlantUmlFileForReflection(plantUml, reflection);
        }

        if (this.shouldGenerateLegends) {
            this.log?.info(`Creating leged for diagram of reflection ${reflection.name} ...`);
            const legend =
                this.options.legendType === LegendType.OnlyIncluded
                    ? DiagramLegendGenerator.createForPlantUmlLines(plantUmlLines)
                    : new DiagramLegend();

            if (this.options.classDiagramHideCircledChar) {
                legend.hideTypeIcons();
            }

            this.diagramLegends.set(reflection.id, legend);
        }

        let imageUrlPromise: Promise<string>;

        if (this.options.outputImageLocation === ImageLocation.Local) {
            imageUrlPromise = this.plantUmlDiagramGenerator
                .generateFromCode(plantUml, this.options.outputImageFormat)
                .then((result: Buffer) => {
                    this.log?.info(`Writing local image file for reflection ${reflection.name} ...`);
                    const absoluteImageFilePath = this.writeLocalImageFileForReflection(result, reflection);
                    this.log?.info(`Creating local image URL for reflection ${reflection.name} ...`);
                    return this.imageUrlGenerator.createLocalImageFileUrl(event.filename, absoluteImageFilePath);
                });
        } else if (this.options.outputImageLocation === ImageLocation.Embed) {
            imageUrlPromise = this.plantUmlDiagramGenerator
                .generateFromCode(plantUml, this.options.outputImageFormat)
                .then((result: Buffer) => {
                    this.log?.info(`Creating embedded image URL for reflection ${reflection.name} ...`);
                    return this.imageUrlGenerator.createEmbeddedImageUrl(result, this.options.outputImageFormat);
                });
        } else {
            imageUrlPromise = new Promise<string>((resolve) => {
                this.log?.info(`Creating remote image URL for reflection ${reflection.name} ...`);
                resolve(this.imageUrlGenerator.createPlantUmlServerUrl(plantUml, this.options.outputImageFormat));
            });
        }

        imageUrlPromise
            .then((imageUrl: string) => {
                this.log?.info(`Inserting diagram into page for reflection ${reflection.name} ...`);
                this.insertHierarchyDiagramIntoFile(event.filename, reflection, imageUrl);
                this.progressBar?.tick();
            })
            .catch((e: Error) => {
                this.log?.error(`Failed inserting diagram into page for reflection ${reflection.name}: ${e.message}`);
            });
    }

    /**
     * Creates a local file with the class diagram of a reflection.
     * @param imageData The image data of the class diagram.
     * @param reflection The reflection for which the file is written.
     * @returns The absolute path to the file that was created.
     */
    private writeLocalImageFileForReflection(imageData: Buffer, reflection: DeclarationReflection): string {
        const filename = reflection.name + "-umlClassDiagram-" + reflection.id + "." + this.options.outputImageFormat;
        const absoluteFilePath = path.join(this.outputDirectory, filename);

        fs.writeFileSync(absoluteFilePath, imageData);
        return absoluteFilePath;
    }

    /**
     * Creates a file containing the PlantUML code.
     * @param plantUml The PlantUML code that should be written into the file.
     * @param reflection The reflection for which the file is written.
     */
    private writePlantUmlFileForReflection(plantUml: string, reflection: DeclarationReflection): void {
        const filename = reflection.name + "-umlClassDiagram-" + reflection.id + ".puml";
        const absoluteFilePath = path.join(this.outputDirectory, filename);

        const fileContent = "@startuml\n" + plantUml + "\n@enduml";
        fs.writeFileSync(absoluteFilePath, fileContent, "utf8");
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
        imageUrl: string
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
        imageUrl: string
    ): string {
        const page = new PageProcessor(originalContent);

        const legend = this.diagramLegends.get(reflection.id);

        const hierarchyDiagramSection = PageSection.createHierarchyDiagramSection(
            this.options.sectionTitle,
            imageUrl,
            reflection.name,
            legend && !legend.isEmpty ? legend.getHtml(this.options.classDiagramMemberVisibilityStyle) : ""
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
            this.log?.info("Attaching content to main.css file ...");

            const filename = path.join(event.outputDirectory, "assets/css/main.css");

            let data =
                fs.readFileSync(filename, "utf8") +
                "\n.tsd-hierarchy-diagram .diagram { max-width: 100%; display: block; margin: 0 auto; text-align: center; }\n";

            if (this.shouldGenerateLegends) {
                data += DiagramLegend.getCss();
            }

            fs.writeFileSync(filename, data, "utf8");

            this.log?.info("DONE");
        }
    }
}
