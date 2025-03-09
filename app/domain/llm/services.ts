import type { LlmConfig, LlmPrompt, LlmResponse } from "./models";

/**
 * Service for interacting with LLM providers
 */
export const LlmService = {
	/**
	 * Send a prompt to Anthropic LLM and get a response
	 * @param config LLM configuration
	 * @param prompt LLM prompt
	 * @param apiKey Anthropic API key
	 * @returns LLM response
	 */
	async sendPrompt(config: LlmConfig, prompt: LlmPrompt, apiKey: string): Promise<LlmResponse> {
		try {
			if (!apiKey) {
				throw new Error("API key is required");
			}
			return await sendToAnthropic(config, prompt, apiKey);
		} catch (error) {
			console.error("Error sending prompt to Anthropic:", error);
			throw error;
		}
	},

	/**
	 * Get available models for Anthropic
	 * @param apiKey Anthropic API key
	 * @returns Array of available model names
	 */
	async getAvailableModels(apiKey: string): Promise<string[]> {
		try {
			if (!apiKey) {
				throw new Error("API key is required");
			}
			return await getAnthropicModels(apiKey);
		} catch (error) {
			console.error("Error getting available models:", error);
			return [];
		}
	},
};

/**
 * Send a prompt to Anthropic Claude
 * @param config LLM configuration
 * @param prompt LLM prompt
 * @param apiKey Anthropic API key
 * @returns LLM response
 */
async function sendToAnthropic(
	config: LlmConfig,
	prompt: LlmPrompt,
	apiKey: string,
): Promise<LlmResponse> {
	try {
		const response = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiKey,
				"anthropic-version": "2023-06-01",
			},
			body: JSON.stringify({
				model: config.model,
				system: prompt.systemPrompt,
				messages: [
					{
						role: "user",
						content: prompt.userPrompt,
					},
				],
				max_tokens: config.maxTokens,
				temperature: config.temperature,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`Anthropic API error: ${errorData.error?.message || "Unknown error"}`);
		}

		const data = await response.json();
		return {
			content: data.content[0].text,
			tokenUsage: {
				prompt: data.usage.input_tokens,
				completion: data.usage.output_tokens,
				total: data.usage.input_tokens + data.usage.output_tokens,
			},
		};
	} catch (error) {
		console.error("Error sending prompt to Anthropic:", error);
		throw error;
	}
}

/**
 * Get available models for Anthropic
 * @param apiKey Anthropic API key
 * @returns Array of available model names
 */
async function getAnthropicModels(apiKey: string): Promise<string[]> {
	try {
		const response = await fetch("https://api.anthropic.com/v1/models", {
			method: "GET",
			headers: {
				"x-api-key": apiKey,
				"anthropic-version": "2023-06-01",
			},
		});

		if (!response.ok) {
			return [];
		}

		const data = await response.json();

		// Define a type for the model object
		type AnthropicModel = {
			id: string;
			name?: string;
			description?: string;
		};

		return data.data.map((model: AnthropicModel) => model.id);
	} catch (error) {
		console.error("Error getting Anthropic models:", error);
		return [];
	}
}
