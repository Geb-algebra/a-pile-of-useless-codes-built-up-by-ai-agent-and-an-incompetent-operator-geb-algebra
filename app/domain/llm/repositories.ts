import localforage from "localforage";
import type { LlmConfig } from "./models";

// Create a dedicated instance for LLM configurations
const llmConfigStore = localforage.createInstance({
	name: "domain-modeler",
	storeName: "llm-configs",
});

/**
 * Repository for persisting LLM configurations
 */
export const LlmConfigRepository = {
	/**
	 * Save an LLM configuration
	 * @param config LLM configuration to save
	 */
	async save(config: LlmConfig): Promise<void> {
		try {
			// In a real implementation, we would encrypt the API key before storing it
			await llmConfigStore.setItem("current-config", config);
		} catch (error) {
			console.error("Failed to save LLM configuration:", error);
			throw new Error("Failed to save LLM configuration");
		}
	},

	/**
	 * Get the current LLM configuration
	 * @returns The current LLM configuration or null if none exists
	 */
	async get(): Promise<LlmConfig | null> {
		try {
			const config = await llmConfigStore.getItem<LlmConfig>("current-config");
			return config;
		} catch (error) {
			console.error("Failed to get LLM configuration:", error);
			throw new Error("Failed to get LLM configuration");
		}
	},

	/**
	 * Delete the current LLM configuration
	 */
	async delete(): Promise<void> {
		try {
			await llmConfigStore.removeItem("current-config");
		} catch (error) {
			console.error("Failed to delete LLM configuration:", error);
			throw new Error("Failed to delete LLM configuration");
		}
	},

	/**
	 * Check if an LLM configuration exists
	 * @returns True if a configuration exists, false otherwise
	 */
	async exists(): Promise<boolean> {
		try {
			const config = await this.get();
			return config !== null;
		} catch (error) {
			return false;
		}
	},
};
