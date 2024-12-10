import { Application } from "typedoc";
import { Plugin } from "./plugin.js";
import { type PluginConfig } from "./plugin_options.js";

/**
 * Type that can be intersected with TypeDoc's config type to have static type checking for the plugin's configuration.
 * Check out the README.md for an example.
 */
export type Config = {
    umlClassDiagram?: PluginConfig;
};

/**
 * Initializes the plugin.
 * @param app Reference to the application that is loading the plugin.
 */
export function load(app: Application): void {
    new Plugin().initialize(app);
}
