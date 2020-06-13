import { PlantUmlPipe } from "plantuml-pipe";
import Queue = require("queue-fifo");

/**
 * Class for generating a diagram from PlantUML code.
 * @typeparam The type of the identifier data.
 */
export class PlantUmlDiagramGenerator<TID> {
    /**
     * The object which encapsulates the PlantUML JAVA process.
     */
    private plantUmlPipe: PlantUmlPipe;

    /**
     * Queue for identifiers of the generated diagrams.
     */
    private identifierQueue = new Queue<unknown>();

    /**
     * Creates a new PlantUML generator object.
     * @param format The format for the generated diagrams.
     * @param imageReadyHandler Callback called whenever a diagram has been generated.
     */
    constructor(format: "png" | "svg", imageReadyHandler: (id: TID, imageData: Buffer) => unknown) {
        this.plantUmlPipe = new PlantUmlPipe({ outputFormat: format });

        this.plantUmlPipe.out.on("data", (imageData: Buffer) => {
            const id = this.identifierQueue.dequeue() as TID;
            imageReadyHandler(id, imageData);
        });
    }

    /**
     * Writes the PlantUML code to the PlantUML generator object.
     * @param id The identifier for the PlantUML code.
     * @param plantUml The PlantUML code.
     */
    public generate(id: TID, plantUml: string): void {
        this.identifierQueue.enqueue(id);
        this.plantUmlPipe.in.write(plantUml);
    }

    /**
     * Shuts the PlantUML diagram generator down.
     */
    public shutdown(): void {
        this.plantUmlPipe.in.end();
    }
}
