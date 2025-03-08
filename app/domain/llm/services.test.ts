import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LlmConfig, LlmPrompt } from "./models";
import { LlmService } from "./services";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("LlmService", () => {
	const testConfig: LlmConfig = {
		provider: "anthropic",
		apiKey: "test-api-key",
		model: "claude-3-sonnet-20240229",
		temperature: 0.7,
		maxTokens: 2000,
	};

	const testPrompt: LlmPrompt = {
		systemPrompt: "You are a helpful assistant.",
		userPrompt: "What is the capital of France?",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("sendPrompt", () => {
		it("should send a prompt to Anthropic and return the response", async () => {
			// Mock successful response from Anthropic
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					content: [{ text: "The capital of France is Paris." }],
					usage: {
						input_tokens: 20,
						output_tokens: 10,
						total_tokens: 30,
					},
				}),
			});

			const response = await LlmService.sendPrompt(testConfig, testPrompt);

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": "test-api-key",
					"anthropic-version": "2023-06-01",
				},
				body: JSON.stringify({
					model: "claude-3-sonnet-20240229",
					system: "You are a helpful assistant.",
					messages: [
						{
							role: "user",
							content: "What is the capital of France?",
						},
					],
					max_tokens: 2000,
					temperature: 0.7,
				}),
			});

			// Check the response
			expect(response).toEqual({
				content: "The capital of France is Paris.",
				tokenUsage: {
					prompt: 20,
					completion: 10,
					total: 30,
				},
			});
		});

		it("should send a prompt to OpenAI and return the response", async () => {
			const openAIConfig: LlmConfig = {
				...testConfig,
				provider: "openai",
				model: "gpt-4",
			};

			// Mock successful response from OpenAI
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					choices: [
						{
							message: {
								content: "The capital of France is Paris.",
							},
						},
					],
					usage: {
						prompt_tokens: 20,
						completion_tokens: 10,
						total_tokens: 30,
					},
				}),
			});

			const response = await LlmService.sendPrompt(openAIConfig, testPrompt);

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.openai.com/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer test-api-key",
				},
				body: JSON.stringify({
					model: "gpt-4",
					messages: [
						{
							role: "system",
							content: "You are a helpful assistant.",
						},
						{
							role: "user",
							content: "What is the capital of France?",
						},
					],
					max_tokens: 2000,
					temperature: 0.7,
				}),
			});

			// Check the response
			expect(response).toEqual({
				content: "The capital of France is Paris.",
				tokenUsage: {
					prompt: 20,
					completion: 10,
					total: 30,
				},
			});
		});

		it("should handle errors from Anthropic", async () => {
			// Mock error response from Anthropic
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({
					error: {
						message: "Invalid API key",
					},
				}),
			});

			await expect(LlmService.sendPrompt(testConfig, testPrompt)).rejects.toThrow(
				"Anthropic API error: Invalid API key",
			);
		});

		it("should handle errors from OpenAI", async () => {
			const openAIConfig: LlmConfig = {
				...testConfig,
				provider: "openai",
				model: "gpt-4",
			};

			// Mock error response from OpenAI
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({
					error: {
						message: "Invalid API key",
					},
				}),
			});

			await expect(LlmService.sendPrompt(openAIConfig, testPrompt)).rejects.toThrow(
				"OpenAI API error: Invalid API key",
			);
		});

		it("should throw an error for unsupported providers", async () => {
			// Use a type assertion to a specific string type instead of any
			const unsupportedConfig: LlmConfig = {
				...testConfig,
				provider: "unsupported" as unknown as "anthropic",
			};

			await expect(LlmService.sendPrompt(unsupportedConfig, testPrompt)).rejects.toThrow(
				"Unsupported provider: unsupported",
			);
		});

		it("should handle network errors", async () => {
			// Mock network error
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await expect(LlmService.sendPrompt(testConfig, testPrompt)).rejects.toThrow("Network error");
		});
	});

	describe("validateApiKey", () => {
		it("should validate an Anthropic API key", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				ok: true,
			});

			const isValid = await LlmService.validateApiKey("anthropic", "test-api-key");

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.anthropic.com/v1/models", {
				method: "GET",
				headers: {
					"x-api-key": "test-api-key",
					"anthropic-version": "2023-06-01",
				},
			});

			// Check the result
			expect(isValid).toBe(true);
		});

		it("should validate an OpenAI API key", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				ok: true,
			});

			const isValid = await LlmService.validateApiKey("openai", "test-api-key");

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.openai.com/v1/models", {
				method: "GET",
				headers: {
					Authorization: "Bearer test-api-key",
				},
			});

			// Check the result
			expect(isValid).toBe(true);
		});

		it("should return false for invalid API keys", async () => {
			// Mock error response
			mockFetch.mockResolvedValueOnce({
				ok: false,
			});

			const isValid = await LlmService.validateApiKey("anthropic", "invalid-api-key");

			// Check the result
			expect(isValid).toBe(false);
		});

		it("should return false for network errors", async () => {
			// Mock network error
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			const isValid = await LlmService.validateApiKey("anthropic", "test-api-key");

			// Check the result
			expect(isValid).toBe(false);
		});

		it("should return false for unsupported providers", async () => {
			const isValid = await LlmService.validateApiKey("unsupported", "test-api-key");

			// Check the result
			expect(isValid).toBe(false);
		});
	});

	describe("getAvailableModels", () => {
		it("should get available models for Anthropic", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [{ id: "claude-3-sonnet-20240229" }, { id: "claude-3-opus-20240229" }],
				}),
			});

			const models = await LlmService.getAvailableModels("anthropic", "test-api-key");

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.anthropic.com/v1/models", {
				method: "GET",
				headers: {
					"x-api-key": "test-api-key",
					"anthropic-version": "2023-06-01",
				},
			});

			// Check the result
			expect(models).toEqual(["claude-3-sonnet-20240229", "claude-3-opus-20240229"]);
		});

		it("should get available models for OpenAI", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						{ id: "gpt-3.5-turbo", object: "model", created: 1, owned_by: "openai" },
						{ id: "gpt-4", object: "model", created: 1, owned_by: "openai" },
						{ id: "text-embedding-ada", object: "model", created: 1, owned_by: "openai" },
					],
				}),
			});

			const models = await LlmService.getAvailableModels("openai", "test-api-key");

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.openai.com/v1/models", {
				method: "GET",
				headers: {
					Authorization: "Bearer test-api-key",
				},
			});

			// Check the result (should only include GPT models)
			expect(models).toEqual(["gpt-3.5-turbo", "gpt-4"]);
		});

		it("should return an empty array for API errors", async () => {
			// Mock error response
			mockFetch.mockResolvedValueOnce({
				ok: false,
			});

			const models = await LlmService.getAvailableModels("anthropic", "test-api-key");

			// Check the result
			expect(models).toEqual([]);
		});

		it("should return an empty array for network errors", async () => {
			// Mock network error
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			const models = await LlmService.getAvailableModels("anthropic", "test-api-key");

			// Check the result
			expect(models).toEqual([]);
		});

		it("should return an empty array for unsupported providers", async () => {
			const models = await LlmService.getAvailableModels("unsupported", "test-api-key");

			// Check the result
			expect(models).toEqual([]);
		});
	});
});
