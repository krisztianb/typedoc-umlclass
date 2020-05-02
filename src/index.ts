import { PluginHost } from "typedoc/dist/lib/utils";
import { PlantUmlPlugin } from "./plugin";

/**
 * Initializes the plugin.
 * @param host Reference to the host that is loading the plugin.
 */
export function load(host: PluginHost): void {
    new PlantUmlPlugin().initialize(host.application);
}
