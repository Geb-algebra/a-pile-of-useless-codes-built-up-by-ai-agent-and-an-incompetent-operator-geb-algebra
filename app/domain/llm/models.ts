/**
 * Information about an LLM model
 */
export type LlmModel = {
	modelName: string;
	contextWindow: number;
	capabilities: string[];
};

/**
 * Configuration for LLM API calls
 */
export type LlmConfig = {
	model: string;
	temperature: number;
	maxTokens: number;
};

/**
 * Prompt structure for LLM requests
 */
export type LlmPrompt = {
	systemPrompt: string;
	userPrompt: string;
	examples?: Array<{
		userPrompt: string;
		assistantResponse: string;
	}>;
};

/**
 * Response from an LLM API call
 */
export type LlmResponse = {
	content: string;
	tokenUsage?: {
		prompt: number;
		completion: number;
		total: number;
	};
};

/**
 * Error from an LLM API call
 */
export type LlmError = {
	message: string;
	code?: string;
};
