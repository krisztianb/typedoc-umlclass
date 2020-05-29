/**
 * A simple console logger.
 */
export class Logger {
    /**
     * Logs an info message to the console.
     * @param message The message to log.
     */
    public info(message: string): void {
        const intro = new Date().toLocaleString() + " [INFO] ";
        console.log(intro + message);
    }

    /**
     * Logs an error message to the console.
     * @param message The message to log.
     */
    public error(message: string): void {
        const intro = new Date().toLocaleString() + " [ERROR] ";
        console.log(intro + message);
    }
}
