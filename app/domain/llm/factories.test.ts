import { describe, expect, it } from "vitest";
import { LlmConfigFactory, LlmPromptFactory } from "./factories";

describe("LlmConfigFactory", () => {
	it("should create a valid LLM configuration", () => {
		const config = LlmConfigFactory.create("anthropic", "test-api-key", "claude-3-sonnet-20240229");

		expect(config).toEqual({
			provider: "anthropic",
			apiKey: "test-api-key",
			model: "claude-3-sonnet-20240229",
			temperature: 0.7,
			maxTokens: 2000,
		});
	});

	it("should create a configuration with custom temperature and maxTokens", () => {
		const config = LlmConfigFactory.create("openai", "test-api-key", "gpt-4", 0.5, 1000);

		expect(config).toEqual({
			provider: "openai",
			apiKey: "test-api-key",
			model: "gpt-4",
			temperature: 0.5,
			maxTokens: 1000,
		});
	});

	it("should throw an error if provider is missing", () => {
		expect(() => {
			// Use a type assertion to a specific string type instead of any
			LlmConfigFactory.create("" as unknown as "anthropic", "test-api-key", "gpt-4");
		}).toThrow("Provider is required");
	});

	it("should throw an error if apiKey is missing", () => {
		expect(() => {
			LlmConfigFactory.create("openai", "", "gpt-4");
		}).toThrow("API key is required");
	});

	it("should throw an error if model is missing", () => {
		expect(() => {
			LlmConfigFactory.create("openai", "test-api-key", "");
		}).toThrow("Model is required");
	});

	it("should throw an error if temperature is out of range", () => {
		expect(() => {
			LlmConfigFactory.create("openai", "test-api-key", "gpt-4", 1.5);
		}).toThrow("Temperature must be between 0 and 1");

		expect(() => {
			LlmConfigFactory.create("openai", "test-api-key", "gpt-4", -0.1);
		}).toThrow("Temperature must be between 0 and 1");
	});

	it("should throw an error if maxTokens is less than 1", () => {
		expect(() => {
			LlmConfigFactory.create("openai", "test-api-key", "gpt-4", 0.7, 0);
		}).toThrow("Max tokens must be greater than 0");

		expect(() => {
			LlmConfigFactory.create("openai", "test-api-key", "gpt-4", 0.7, -10);
		}).toThrow("Max tokens must be greater than 0");
	});
});

describe("LlmPromptFactory", () => {
	it("should create a valid LLM prompt", () => {
		const prompt = LlmPromptFactory.create(
			"You are a helpful assistant.",
			"What is the capital of France?",
		);

		expect(prompt).toEqual({
			systemPrompt: "You are a helpful assistant.",
			userPrompt: "What is the capital of France?",
			examples: undefined,
		});
	});

	it("should create a prompt with examples", () => {
		const examples = [
			{
				userPrompt: "What is the capital of Spain?",
				assistantResponse: "The capital of Spain is Madrid.",
			},
		];

		const prompt = LlmPromptFactory.create(
			"You are a helpful assistant.",
			"What is the capital of France?",
			examples,
		);

		expect(prompt).toEqual({
			systemPrompt: "You are a helpful assistant.",
			userPrompt: "What is the capital of France?",
			examples,
		});
	});

	it("should throw an error if systemPrompt is missing", () => {
		expect(() => {
			LlmPromptFactory.create("", "What is the capital of France?");
		}).toThrow("System prompt is required");
	});

	it("should throw an error if userPrompt is missing", () => {
		expect(() => {
			LlmPromptFactory.create("You are a helpful assistant.", "");
		}).toThrow("User prompt is required");
	});

	it("should create a ubiquitous language prompt", () => {
		const prompt = LlmPromptFactory.createUbiquitousLanguagePrompt(
			"Customers place orders for products",
		);

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("ubiquitous language terms");
		expect(prompt.userPrompt).toBe("Customers place orders for products");
	});

	it("should create a use cases prompt", () => {
		const prompt = LlmPromptFactory.createUseCasesPrompt("Customers place orders for products");

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("use cases");
		expect(prompt.userPrompt).toBe("Customers place orders for products");
	});

	it("should create a clarifying questions prompt", () => {
		const terms = [
			{ name: "Customer", description: "A person who buys products" },
			{ name: "Order", description: "A request to purchase products" },
		];
		const useCases = ["Customer places an order", "Customer cancels an order"];
		const userInputHistory = ["Customers place orders for products"];
		const previousResponses = ["I've extracted some terms and use cases"];

		const prompt = LlmPromptFactory.createClarifyingQuestionsPrompt(
			terms,
			useCases,
			userInputHistory,
			previousResponses,
		);

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("clarifying questions");
		expect(JSON.parse(prompt.userPrompt)).toEqual({
			terms,
			useCases,
			userInputHistory,
			previousResponses,
		});
	});

	it("should create a domain model prompt", () => {
		const terms = [
			{ name: "Customer", description: "A person who buys products" },
			{ name: "Order", description: "A request to purchase products" },
		];
		const useCases = ["Customer places an order", "Customer cancels an order"];
		const descriptions = {
			Customer: "A person who buys products",
			Order: "A request to purchase products",
		};

		const prompt = LlmPromptFactory.createDomainModelPrompt(terms, useCases, descriptions);

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("complete domain model");
		expect(JSON.parse(prompt.userPrompt)).toEqual({
			terms,
			useCases,
			descriptions,
		});
	});

	it("should create a refine domain model prompt", () => {
		const currentModel = {
			entities: [{ id: "1", name: "Customer", properties: {} }],
			valueObjects: [],
			aggregates: [],
			boundedContexts: [],
			events: [],
			commands: [],
			relationships: [],
		};
		const refinementInstruction = "Add an Order entity";

		const prompt = LlmPromptFactory.createRefineDomainModelPrompt(
			currentModel,
			refinementInstruction,
		);

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("Refine the provided domain model");
		expect(JSON.parse(prompt.userPrompt)).toEqual({
			currentModel,
			refinementInstruction,
		});
	});

	it("should create a refinement suggestions prompt", () => {
		const currentModel = {
			entities: [{ id: "1", name: "Customer", properties: {} }],
			valueObjects: [],
			aggregates: [],
			boundedContexts: [],
			events: [],
			commands: [],
			relationships: [],
		};

		const prompt = LlmPromptFactory.createRefinementSuggestionsPrompt(currentModel);

		expect(prompt.systemPrompt).toContain("domain modeling expert");
		expect(prompt.systemPrompt).toContain("suggest potential improvements");
		expect(JSON.parse(prompt.userPrompt)).toEqual(currentModel);
	});
});
