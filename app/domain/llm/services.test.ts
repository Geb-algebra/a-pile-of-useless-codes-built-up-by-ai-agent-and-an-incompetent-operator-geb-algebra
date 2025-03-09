import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LlmConfig, LlmPrompt } from "./models";
import { LlmService } from "./services";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test API key
const TEST_API_KEY = "test-api-key";

describe("LlmService", () => {
	const testConfig: LlmConfig = {
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

			const response = await LlmService.sendPrompt(testConfig, testPrompt, TEST_API_KEY);

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": TEST_API_KEY,
					"anthropic-version": "2023-06-01",
				},
				body: JSON.stringify({
					model: testConfig.model,
					system: testPrompt.systemPrompt,
					messages: [
						{
							role: "user",
							content: testPrompt.userPrompt,
						},
					],
					max_tokens: testConfig.maxTokens,
					temperature: testConfig.temperature,
				}),
			});

			// Check the response structure
			expect(response).toEqual({
				content: "The capital of France is Paris.",
				tokenUsage: {
					prompt: 20,
					completion: 10,
					total: 30,
				},
			});
		});

		it("should throw an error if the API call fails", async () => {
			// Mock failed response from Anthropic
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: async () => ({
					error: {
						message: "Invalid API key",
					},
				}),
			});

			await expect(LlmService.sendPrompt(testConfig, testPrompt, TEST_API_KEY)).rejects.toThrow(
				"Anthropic API error: Invalid API key",
			);
		});

		it("should throw an error if API key is not provided", async () => {
			await expect(LlmService.sendPrompt(testConfig, testPrompt, "")).rejects.toThrow(
				"API key is required",
			);
		});
	});

	describe("getAvailableModels", () => {
		it("should get available models from Anthropic", async () => {
			// Mock successful response from Anthropic
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					data: [
						{ id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
						{ id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
					],
				}),
			});

			const models = await LlmService.getAvailableModels(TEST_API_KEY);

			// Check that fetch was called with the correct arguments
			expect(mockFetch).toHaveBeenCalledWith("https://api.anthropic.com/v1/models", {
				method: "GET",
				headers: {
					"x-api-key": TEST_API_KEY,
					"anthropic-version": "2023-06-01",
				},
			});

			// Check the models returned
			expect(models).toEqual(["claude-3-opus-20240229", "claude-3-sonnet-20240229"]);
		});

		it("should return an empty array if the API call fails", async () => {
			// Mock failed response from Anthropic
			mockFetch.mockResolvedValueOnce({
				ok: false,
			});

			const models = await LlmService.getAvailableModels(TEST_API_KEY);

			expect(models).toEqual([]);
		});

		it("should throw an error if API key is not provided", async () => {
			await expect(LlmService.getAvailableModels("")).rejects.toThrow("API key is required");
		});
	});
});
