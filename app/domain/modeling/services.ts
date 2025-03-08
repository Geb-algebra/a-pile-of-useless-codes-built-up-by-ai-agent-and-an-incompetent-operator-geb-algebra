import { LlmPromptFactory } from "~/domain/llm/factories";
import type { LlmConfig } from "~/domain/llm/models";
import { LlmService } from "~/domain/llm/services";
import type { BrandedString } from "~/utils/types";
import type {
	Aggregate,
	Command,
	Entity,
	Event,
	UbiquitousLanguage,
	UseCase,
	ValueObject,
} from "./models";

/**
 * Represents a complete domain model with all its components
 */
export type DomainModelResult = {
	entities: Entity[];
	valueObjects: ValueObject[];
	aggregates: Aggregate[];
	boundedContexts: BoundedContext[];
	events: Event[];
	commands: Command[];
	relationships: Relationship[];
};

/**
 * Represents a bounded context in the domain model
 */
export type BoundedContext = {
	name: BrandedString<"BoundedContextName">;
	description: string;
	aggregates: Aggregate[];
};

/**
 * Represents a relationship between domain objects
 */
export type Relationship = {
	id: string;
	sourceId: string;
	targetId: string;
	type: RelationshipType;
	description: string;
};

/**
 * Types of relationships between domain objects
 */
export enum RelationshipType {
	OneToOne = "OneToOne",
	OneToMany = "OneToMany",
	ManyToOne = "ManyToOne",
	ManyToMany = "ManyToMany",
	Composition = "Composition",
	Aggregation = "Aggregation",
	Inheritance = "Inheritance",
}

/**
 * Service for extracting domain model elements from user input and LLM responses
 */
export const ModelExtractionService = {
	/**
	 * Extract ubiquitous language terms from user input
	 * @param input User input text
	 * @param llmConfig LLM configuration
	 * @returns Array of ubiquitous language terms
	 */
	async extractUbiquitousLanguage(
		input: string,
		llmConfig: LlmConfig,
	): Promise<UbiquitousLanguage[]> {
		try {
			const prompt = LlmPromptFactory.createUbiquitousLanguagePrompt(input);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response and convert to UbiquitousLanguage objects
			const terms = JSON.parse(response.content);
			return terms.map((term: { name: string; description: string }) => ({
				name: term.name as BrandedString<"UbiquitousLanguageName">,
				description: term.description,
			}));
		} catch (error) {
			console.error("Failed to extract ubiquitous language:", error);
			return [];
		}
	},

	/**
	 * Extract use cases from user input
	 * @param input User input text
	 * @param llmConfig LLM configuration
	 * @returns Array of use cases
	 */
	async extractUseCases(input: string, llmConfig: LlmConfig): Promise<UseCase[]> {
		try {
			const prompt = LlmPromptFactory.createUseCasesPrompt(input);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response and convert to UseCase objects
			const useCases = JSON.parse(response.content);
			return useCases.map((useCase: string) => useCase as BrandedString<"UseCase">);
		} catch (error) {
			console.error("Failed to extract use cases:", error);
			return [];
		}
	},

	/**
	 * Generate questions to refine understanding based on all available context
	 * @param terms Ubiquitous language terms extracted so far
	 * @param useCases Use cases extracted so far
	 * @param userInputHistory Array of previous user inputs
	 * @param previousResponses Array of previous system responses
	 * @param llmConfig LLM configuration
	 * @returns Array of clarifying questions
	 */
	async generateClarifyingQuestions(
		terms: UbiquitousLanguage[],
		useCases: UseCase[],
		userInputHistory: string[],
		previousResponses: string[],
		llmConfig: LlmConfig,
	): Promise<string[]> {
		try {
			const prompt = LlmPromptFactory.createClarifyingQuestionsPrompt(
				terms.map((term) => ({
					name: term.name as string,
					description: term.description,
				})),
				useCases as string[],
				userInputHistory,
				previousResponses,
			);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response
			return JSON.parse(response.content);
		} catch (error) {
			console.error("Failed to generate clarifying questions:", error);
			return [];
		}
	},
};

/**
 * Service for generating a cohesive domain model based on ubiquitous language and use cases
 */
export const ModelGenerationService = {
	/**
	 * Generate a complete domain model including entities, value objects, aggregates, and bounded contexts
	 * @param terms Ubiquitous language terms
	 * @param useCases Use cases
	 * @param descriptions Record of descriptions for terms and use cases
	 * @param llmConfig LLM configuration
	 * @returns Complete domain model
	 */
	async generateDomainModel(
		terms: UbiquitousLanguage[],
		useCases: UseCase[],
		descriptions: Record<string, string>,
		llmConfig: LlmConfig,
	): Promise<DomainModelResult> {
		try {
			const prompt = LlmPromptFactory.createDomainModelPrompt(
				terms.map((term) => ({
					name: term.name as string,
					description: term.description,
				})),
				useCases as string[],
				descriptions,
			);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response and convert to DomainModelResult
			const model = JSON.parse(response.content);
			return {
				entities: model.entities || [],
				valueObjects: model.valueObjects || [],
				aggregates: model.aggregates || [],
				boundedContexts: model.boundedContexts || [],
				events: model.events || [],
				commands: model.commands || [],
				relationships: model.relationships || [],
			};
		} catch (error) {
			console.error("Failed to generate domain model:", error);
			return {
				entities: [],
				valueObjects: [],
				aggregates: [],
				boundedContexts: [],
				events: [],
				commands: [],
				relationships: [],
			};
		}
	},
};

/**
 * Service for refining the domain model based on user feedback
 */
export const ModelRefinementService = {
	/**
	 * Apply a natural language refinement instruction to update the domain model
	 * @param currentModel Current domain model
	 * @param refinementInstruction Natural language instruction for refinement
	 * @param llmConfig LLM configuration
	 * @returns Updated domain model
	 */
	async refineDomainModel(
		currentModel: DomainModelResult,
		refinementInstruction: string,
		llmConfig: LlmConfig,
	): Promise<DomainModelResult> {
		try {
			const prompt = LlmPromptFactory.createRefineDomainModelPrompt(
				currentModel,
				refinementInstruction,
			);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response and convert to DomainModelResult
			const model = JSON.parse(response.content);
			return {
				entities: model.entities || currentModel.entities,
				valueObjects: model.valueObjects || currentModel.valueObjects,
				aggregates: model.aggregates || currentModel.aggregates,
				boundedContexts: model.boundedContexts || currentModel.boundedContexts,
				events: model.events || currentModel.events,
				commands: model.commands || currentModel.commands,
				relationships: model.relationships || currentModel.relationships,
			};
		} catch (error) {
			console.error("Failed to refine domain model:", error);
			return { ...currentModel };
		}
	},

	/**
	 * Analyze the current model and suggest potential improvements
	 * @param currentModel Current domain model
	 * @param llmConfig LLM configuration
	 * @returns Array of natural language improvement suggestions
	 */
	async generateRefinementSuggestions(
		currentModel: DomainModelResult,
		llmConfig: LlmConfig,
	): Promise<string[]> {
		try {
			const prompt = LlmPromptFactory.createRefinementSuggestionsPrompt(currentModel);
			const response = await LlmService.sendPrompt(llmConfig, prompt);

			// Parse the response
			return JSON.parse(response.content);
		} catch (error) {
			console.error("Failed to generate refinement suggestions:", error);
			return [];
		}
	},
};

/**
 * Service for exporting the domain model in various formats
 */
export const ExportService = {
	/**
	 * Generate markdown representation of the domain model
	 * @param entities Entities in the domain model
	 * @param valueObjects Value objects in the domain model
	 * @param aggregates Aggregates in the domain model
	 * @param events Events in the domain model
	 * @param commands Commands in the domain model
	 * @returns Markdown representation of the domain model
	 */
	generateMarkdown(
		entities: Entity[],
		valueObjects: ValueObject[],
		aggregates: Aggregate[],
		events: Event[],
		commands: Command[],
	): string {
		// This would be implemented with markdown generation logic
		// For now, return a placeholder markdown
		return "# Domain Model\n\n## Entities\n\n## Value Objects\n\n## Aggregates\n\n## Events\n\n## Commands";
	},

	/**
	 * Generate a visual diagram of the domain model
	 * @param entities Entities in the domain model
	 * @param valueObjects Value objects in the domain model
	 * @param aggregates Aggregates in the domain model
	 * @returns Mermaid diagram code for the domain model
	 */
	generateDiagram(
		entities: Entity[],
		valueObjects: ValueObject[],
		aggregates: Aggregate[],
	): string {
		// This would be implemented with diagram generation logic (e.g., Mermaid)
		// For now, return a placeholder diagram
		return "graph TD\n    A[Entity 1] --> B[Entity 2]\n    B --> C[Value Object 1]";
	},
};
