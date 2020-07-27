import { PlantUmlPipe } from "plantuml-pipe";
import Queue = require("queue-fifo");

/**
 * Type that groups data for a PlantUML process.
 */
type PlantUmlProcessInfo<DiagramId> = {
    /** The object that encapsulates the PlantUML process. */
    pipe: PlantUmlPipe;

    /** Stores the ID and the order of the diagrams that the process is generating. */
    diagramIdQueue: Queue<DiagramId>;
};

/**
 * Class for generating diagrams from PlantUML code.
 * This class can spawn multiple PlantUML processes and evenly schedules the work between them.
 * @typeparam The type of the diagram identifier data.
 */
export class PlantUmlDiagramGenerator<DiagramId> {
    /** Number of PlantUML processes used to schedule the diagram generation. */
    private processCount: number;

    /** The format for the generated diagrams. */
    private outputFormat: "png" | "svg";

    /** Callback that should be called whenever a diagram has been generated. */
    private imageGeneratedHandler: (id: DiagramId, imageData: Buffer) => unknown;

    /** The object which encapsulates the PlantUML processes. */
    private plantUmlProcesses = new Array<PlantUmlProcessInfo<DiagramId>>();

    /** Index of the process that should generate the next diagram. */
    private nextProcessToGetWorkIndex = 0;

    /**
     * Creates a new PlantUML generator object.
     * @param processCount Number of PlantUML processes used to schedule the diagram generation.
     * @param format The format for the generated diagrams.
     * @param imageGeneratedHandler Callback called whenever a diagram has been generated.
     */
    constructor(
        processCount: number,
        format: "png" | "svg",
        imageGeneratedHandler: (id: DiagramId, imageData: Buffer) => unknown,
    ) {
        if (processCount <= 0) {
            throw new Error("processCount must be > 0");
        }

        this.processCount = processCount;
        this.outputFormat = format;
        this.imageGeneratedHandler = imageGeneratedHandler;
    }

    /**
     * Writes the PlantUML code to a PlantUML process that generates the diagram.
     * @param id The identifier for the diagram.
     * @param plantUml The PlantUML code for the diagram.
     */
    public generate(id: DiagramId, plantUml: string): void {
        const process = this.getNextProcess();

        process.diagramIdQueue.enqueue(id);
        process.pipe.in.write(plantUml);
    }

    /**
     * Returns an object which encapsulates a PlantUML process that should generate the next diagram.
     * @returns An object for the process that should generate the next diagram.
     */
    private getNextProcess(): PlantUmlProcessInfo<DiagramId> {
        const processToWorkIndex = this.nextProcessToGetWorkIndex;

        this.maybeSpawnNewProcess();

        this.setNextProcessForWork();

        return this.plantUmlProcesses[processToWorkIndex];
    }

    /**
     * If necessary, spawns a new PlantUML process and stores it in the internal process array.
     */
    private maybeSpawnNewProcess(): void {
        if (this.nextProcessToGetWorkIndex >= this.plantUmlProcesses.length) {
            const newPipe = new PlantUmlPipe({ outputFormat: this.outputFormat });
            const newQueue = new Queue<DiagramId>();

            newPipe.out.on("data", (imageData: Buffer) => {
                const id = newQueue.dequeue() as DiagramId;
                this.imageGeneratedHandler(id, imageData);
            });

            this.plantUmlProcesses.push({ pipe: newPipe, diagramIdQueue: newQueue });
        }
    }

    /**
     * Sets the internal index for the process that should receive the next job.
     */
    private setNextProcessForWork(): void {
        this.nextProcessToGetWorkIndex++;

        if (this.nextProcessToGetWorkIndex === this.processCount) {
            this.nextProcessToGetWorkIndex = 0;
        }
    }

    /**
     * Notifies the PlantUML diagram generator processes that there is no more job to do.
     */
    public shutdown(): void {
        for (const process of this.plantUmlProcesses) {
            process.pipe.in.end();
        }
    }
}
