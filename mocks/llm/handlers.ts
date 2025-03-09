import { delay, http, HttpResponse } from "msw";

// Define the expected request body type for Anthropic API
interface AnthropicMessagesRequestBody {
	model: string;
	system: string;
	messages: Array<{ role: string; content: string }>;
	max_tokens: number;
	temperature: number;
}

/**
 * Mock handlers for Anthropic API endpoints
 */
export const handlers = [
	// Mock Anthropic messages endpoint
	http.post("https://api.anthropic.com/v1/messages", async ({ request }) => {
		// Parse the request body
		const body = (await request.json()) as AnthropicMessagesRequestBody;

		// Extract relevant fields
		const { model, system, messages, max_tokens, temperature } = body;
		const userMessage = messages[0]?.content || "";

		// Mock response based on request content
		// In a real implementation, you might want to have different responses for different inputs
		const mockResponse = {
			content: [
				{
					text: `This is a mock response from ${model} with temperature ${temperature}. You asked: "${userMessage}"`,
				},
			],
			usage: {
				input_tokens: 30,
				output_tokens: 50,
				total_tokens: 80,
			},
		};

		// Add a small delay to simulate network latency
		await delay(300);

		return HttpResponse.json(mockResponse);
	}),

	// Mock Anthropic models endpoint
	http.get("https://api.anthropic.com/v1/models", async () => {
		const mockModels = {
			data: [
				{ id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
				{ id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
				{ id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
			],
		};

		// Add a small delay to simulate network latency
		await delay(200);

		return HttpResponse.json(mockModels);
	}),
];
