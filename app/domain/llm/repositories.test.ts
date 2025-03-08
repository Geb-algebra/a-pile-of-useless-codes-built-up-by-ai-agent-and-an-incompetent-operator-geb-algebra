import { describe, expect, it } from "vitest";
import type { LlmConfig } from "./models";
import { LlmConfigRepository } from "./repositories";

describe("LlmConfigRepository", () => {
	const testConfig: LlmConfig = {
		provider: "anthropic",
		apiKey: "test-api-key",
		model: "claude-3-sonnet-20240229",
		temperature: 0.7,
		maxTokens: 2000,
	};

	it("should save an LLM configuration", async () => {
		await LlmConfigRepository.save(testConfig);
		const savedConfig = await LlmConfigRepository.get();
		expect(savedConfig).toEqual(testConfig);
	});

	it("should get a saved LLM configuration", async () => {
		await LlmConfigRepository.save(testConfig);
		const config = await LlmConfigRepository.get();
		expect(config).toEqual(testConfig);
	});

	it("should return null if no configuration exists", async () => {
		// Make sure no config exists
		await LlmConfigRepository.delete();
		const config = await LlmConfigRepository.get();
		expect(config).toBeNull();
	});

	it("should delete an LLM configuration", async () => {
		await LlmConfigRepository.save(testConfig);
		await LlmConfigRepository.delete();
		const config = await LlmConfigRepository.get();
		expect(config).toBeNull();
	});

	it("should check if a configuration exists", async () => {
		await LlmConfigRepository.save(testConfig);
		const exists = await LlmConfigRepository.exists();
		expect(exists).toBe(true);

		await LlmConfigRepository.delete();
		const notExists = await LlmConfigRepository.exists();
		expect(notExists).toBe(false);
	});

	// TODO: 異常系のテストを追加する
});
