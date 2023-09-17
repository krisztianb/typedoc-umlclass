import { PlantUmlPipe } from "plantuml-pipe";
import Queue = require("queue-fifo");

/** Type that holds a reference to a function which resolves a promise that a diagram has been generated. */
type DiagramResolver = { resolve: (imageData: Readonly<Buffer>) => void };

/**
 * Type that groups data for a PlantUML process.
 */
type PlantUmlProcessInfo = {
    /** The object that encapsulates the PlantUML process. */
    pipe: PlantUmlPipe;

    /**
     * Stores functions that are used to resolve generated promise objects
     * in the order of the diagrams that the process is generating.
     */
    diagramQueue: Queue<DiagramResolver>;
};

/**
 * Class for generating diagrams from PlantUML code.
 * This class can spawn multiple PlantUML processes and evenly schedules the work between them.
 */
export class PlantUmlDiagramGenerator {
    /** Number of PlantUML processes used to schedule the diagram generation. */
    private readonly processCount: number;

    /** The format for the generated diagrams. */
    private readonly outputFormat: "png" | "svg";

    /** The object which encapsulates the PlantUML processes. */
    private readonly plantUmlProcesses = new Array<PlantUmlProcessInfo>();

    /** Index of the process that should generate the next diagram. */
    private nextProcessToGetWorkIndex = 0;

    /**
     * Creates a new PlantUML generator object.
     * @param processCount Number of PlantUML processes used to schedule the diagram generation.
     * @param format The format for the generated diagrams.
     */
    public constructor(processCount: number, format: "png" | "svg") {
        if (processCount <= 0) {
            throw new Error("processCount must be > 0");
        }

        this.processCount = processCount;
        this.outputFormat = format;
    }

    /**
     * Writes the PlantUML code to a PlantUML process that generates the diagram.
     * @param plantUml The PlantUML code for the diagram.
     * @returns A promise that the diagram has been generated.
     */
    public async generate(plantUml: string): Promise<Readonly<Buffer>> {
        const process = this.getNextProcess();

        // Here we create a promise that is resolved once the diagram has been generated
        let resolver: DiagramResolver["resolve"] | undefined;
        const promise = new Promise<Readonly<Buffer>>((resolve) => {
            resolver = resolve;
        });

        process.diagramQueue.enqueue({
            resolve: resolver ?? ((): void => {}),
        });

        process.pipe.in.write(plantUml);

        return promise;
    }

    /**
     * Notifies the PlantUML diagram generator processes that there is no more job to do.
     */
    public shutdown(): void {
        for (const process of this.plantUmlProcesses) {
            process.pipe.in.end();
        }
    }

    /**
     * Returns an object which encapsulates a PlantUML process that should generate the next diagram.
     * @returns An object for the process that should generate the next diagram.
     */
    private getNextProcess(): PlantUmlProcessInfo {
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
            const newQueue = new Queue<DiagramResolver>();

            newPipe.out.on("data", (imageData: Readonly<Buffer>) => {
                const diagram = newQueue.dequeue() as DiagramResolver;
                diagram.resolve(imageData);
            });

            this.plantUmlProcesses.push({ pipe: newPipe, diagramQueue: newQueue });
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
}
