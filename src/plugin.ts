import * as fs from "fs";
import * as path from "path";
import { Application, DeclarationReflection, ReflectionKind } from "typedoc";
import { Context, Converter } from "typedoc/dist/lib/converter";
import { PageEvent, RendererEvent } from "typedoc/dist/lib/output/events";
import { ImageGenerator } from "./image_generator";
import { CachingPlantUmlGenerator } from "./plantuml/caching_plantuml_generator";
import { PlantUmlUtils } from "./plantuml/plantuml_utils";
import { ClassDiagramPosition, ClassDiagramType, ImageLocation, PluginOptions } from "./plugin_options";
import { PageProcessor } from "./typedoc/page_processor";
import { PageSections } from "./typedoc/page_section";
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
    private localImageGenerator = new ImageGenerator();

    /** Object that generates the PlantUML code. */
    private plantUmlGenerator!: CachingPlantUmlGenerator;

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

        this.plantUmlGenerator = new CachingPlantUmlGenerator(this.options);
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
     * Processes the page by inserting a UML class diagram into it.
     * @param event The page event with the page data.
     */
    private processPage(event: PageEvent): void {
        const reflection = event.model as DeclarationReflection;
        const plantUmlLines = this.plantUmlGenerator.createClassDiagramPlantUmlForReflection(reflection);
        const encodedPlantUml = PlantUmlUtils.encode(plantUmlLines.join("\n"));

        let imageUrl = "";

        if (this.options.outputImageLocation === ImageLocation.Local) {
            const absoluteImagePath = this.localImageGenerator.writeImageFile(
                encodedPlantUml,
                reflection.name,
                this.options.outputImageFormat
            );
            imageUrl = path.relative(path.dirname(event.filename), absoluteImagePath);
        } else {
            imageUrl = PlantUmlUtils.createPlantUmlServerUrl(encodedPlantUml, this.options.outputImageFormat);
        }

        const hierarchyDiagramSection = this.createHierarchyDiagramSection(imageUrl, reflection.name);

        const page = new PageProcessor(event.contents);

        if (this.options.umlClassDiagramPosition === ClassDiagramPosition.Above) {
            page.insertAboveSection(PageSections.Hierarchy, hierarchyDiagramSection);
        } else {
            page.insertBelowSection(PageSections.Hierarchy, hierarchyDiagramSection);
        }

        event.contents = page.content;
    }

    /**
     * Creates HTML for a section containing a hierarchy diagram.
     * @param imageUrl The URL to the hierarchy diagram.
     * @param reflectionName The name of the reflection for which the hierarchy diagram was generated.
     * @returns The HTML for the section.
     */
    private createHierarchyDiagramSection(imageUrl: string, reflectionName: string): string {
        return `<section class="tsd-panel tsd-hierarchy">
                    <h3>${this.options.umlClassDiagramSectionTitle}</h3>
                        <a class="uml-class" href="${imageUrl}" title="Click to enlarge">
                            <img src="${imageUrl}"
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
