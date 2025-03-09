import type { LlmConfig, LlmPrompt } from "./models";

/**
 * Factory for creating LLM configuration objects
 */
export const LlmConfigFactory = {
	/**
	 * Create a new LLM configuration
	 * @param model Model name to use
	 * @param temperature Temperature parameter (0.0-1.0)
	 * @param maxTokens Maximum tokens to generate
	 * @returns LLM configuration object
	 */
	create(model: string, temperature = 0.7, maxTokens = 2000): LlmConfig {
		if (!model) {
			throw new Error("Model is required");
		}

		if (temperature < 0 || temperature > 1) {
			throw new Error("Temperature must be between 0 and 1");
		}

		if (maxTokens < 1) {
			throw new Error("Max tokens must be greater than 0");
		}

		return {
			model,
			temperature,
			maxTokens,
		};
	},
};

/**
 * Factory for creating LLM prompt objects
 */
export const LlmPromptFactory = {
	/**
	 * Create a new LLM prompt
	 * @param systemPrompt System prompt for the LLM
	 * @param userPrompt User prompt for the LLM
	 * @param examples Optional examples for few-shot learning
	 * @returns LLM prompt object
	 */
	create(
		systemPrompt: string,
		userPrompt: string,
		examples?: Array<{ userPrompt: string; assistantResponse: string }>,
	): LlmPrompt {
		if (!systemPrompt) {
			throw new Error("System prompt is required");
		}

		if (!userPrompt) {
			throw new Error("User prompt is required");
		}

		return {
			systemPrompt,
			userPrompt,
			examples,
		};
	},

	/**
	 * Create a domain modeling prompt for extracting ubiquitous language
	 * @param userInput User's description of their domain
	 * @returns LLM prompt object
	 */
	createUbiquitousLanguagePrompt(userInput: string): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Extract ubiquitous language terms from the user's input. " +
				"For each term, provide a name and description. " +
				"Return the result as a JSON array of objects with 'name' and 'description' properties.",
			userInput,
		);
	},

	/**
	 * Create a domain modeling prompt for extracting use cases
	 * @param userInput User's description of their domain
	 * @returns LLM prompt object
	 */
	createUseCasesPrompt(userInput: string): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Extract use cases from the user's input. " +
				"A use case is a specific scenario or action that a user can perform in the system. " +
				"Return the result as a JSON array of strings, each representing a use case.",
			userInput,
		);
	},

	/**
	 * Create a domain modeling prompt for generating clarifying questions
	 * @param terms Ubiquitous language terms extracted so far
	 * @param useCases Use cases extracted so far
	 * @param userInputHistory Array of previous user inputs
	 * @param previousResponses Array of previous system responses
	 * @returns LLM prompt object
	 */
	createClarifyingQuestionsPrompt(
		terms: Array<{ name: string; description: string }>,
		useCases: string[],
		userInputHistory: string[],
		previousResponses: string[],
	): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Generate clarifying questions to refine understanding of the domain. " +
				"Consider the extracted ubiquitous language terms, use cases, and conversation history. " +
				"Focus on areas that are ambiguous, incomplete, or need more detail. " +
				"Return the result as a JSON array of strings, each representing a question.",
			JSON.stringify({
				terms,
				useCases,
				userInputHistory,
				previousResponses,
			}),
		);
	},

	/**
	 * Create a domain modeling prompt for generating a domain model
	 * @param terms Ubiquitous language terms
	 * @param useCases Use cases
	 * @param descriptions Additional descriptions
	 * @returns LLM prompt object
	 */
	createDomainModelPrompt(
		terms: Array<{ name: string; description: string }>,
		useCases: string[],
		descriptions: Record<string, string>,
	): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Generate a complete domain model based on the provided ubiquitous language terms, use cases, and descriptions. " +
				"The domain model should include entities, value objects, aggregates, bounded contexts, events, commands, and relationships. " +
				"Follow Domain-Driven Design principles. " +
				"Return the result as a JSON object with the following structure: " +
				"{ entities: [], valueObjects: [], aggregates: [], boundedContexts: [], events: [], commands: [], relationships: [] }",
			JSON.stringify({
				terms,
				useCases,
				descriptions,
			}),
		);
	},

	/**
	 * Create a domain modeling prompt for refining a domain model
	 * @param currentModel Current domain model
	 * @param refinementInstruction Natural language instruction for refinement
	 * @returns LLM prompt object
	 */
	createRefineDomainModelPrompt(currentModel: object, refinementInstruction: string): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Refine the provided domain model based on the refinement instruction. " +
				"Maintain the integrity and consistency of the model while applying the requested changes. " +
				"Return the updated model as a JSON object with the same structure as the input model.",
			JSON.stringify({
				currentModel,
				refinementInstruction,
			}),
		);
	},

	/**
	 * Create a domain modeling prompt for generating refinement suggestions
	 * @param currentModel Current domain model
	 * @returns LLM prompt object
	 */
	createRefinementSuggestionsPrompt(currentModel: object): LlmPrompt {
		return this.create(
			"You are a domain modeling expert. Analyze the provided domain model and suggest potential improvements. " +
				"Consider aspects like completeness, consistency, and adherence to domain-driven design principles. " +
				"Look for missing entities, relationships, or bounded contexts. " +
				"Return the result as a JSON array of strings, each representing a suggestion.",
			JSON.stringify(currentModel),
		);
	},
};
