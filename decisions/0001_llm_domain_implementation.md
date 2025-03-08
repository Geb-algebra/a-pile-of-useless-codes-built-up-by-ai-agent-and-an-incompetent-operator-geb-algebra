# ADR 0001: LLM Domain Implementation

## Status

Proposed

## Context

The Domain Modeler application needs to integrate with Large Language Models (LLMs) to implement the business logic for domain modeling. The application follows a client-only approach with a Bring Your Own Key (BYOK) strategy, where users provide their own API keys for LLM providers.

Key requirements:

1. Support multiple LLM providers (Anthropic as first priority, then others)
2. Client-side implementation with no server component
3. Secure handling of user-provided API keys
4. Consistent interface for domain services to interact with LLMs
5. Maintainable code that can adapt to API changes from providers

## Decision

We will implement a dedicated LLM domain with the following components:

### 1. Models (`app/domain/llm/models.ts`)

```typescript
export type LlmProvider = "anthropic" | "openai" | "google" | "mistral";

export type LlmModel = {
  provider: LlmProvider;
  modelName: string;
  contextWindow: number;
  capabilities: string[];
};

export type LlmConfig = {
  provider: LlmProvider;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
};

export type LlmPrompt = {
  systemPrompt: string;
  userPrompt: string;
  examples?: Array<{
    userPrompt: string;
    assistantResponse: string;
  }>;
};

export type LlmResponse = {
  content: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
};
```

### 2. Factories (`app/domain/llm/factories.ts`)

```typescript
export const LlmConfigFactory = {
  create(provider: LlmProvider, apiKey: string, model: string, temperature = 0.7, maxTokens = 2000): LlmConfig {
    // Validation logic
    return { provider, apiKey, model, temperature, maxTokens };
  }
};

export const LlmPromptFactory = {
  create(systemPrompt: string, userPrompt: string, examples?: Array<{ userPrompt: string; assistantResponse: string }>): LlmPrompt {
    // Validation logic
    return { systemPrompt, userPrompt, examples };
  }
};
```

### 3. Repositories (`app/domain/llm/repositories.ts`)

```typescript
export const LlmConfigRepository = {
  async save(config: LlmConfig): Promise<void> {
    // Save to localforage with encryption for API key
  },
  
  async get(): Promise<LlmConfig | null> {
    // Get from localforage
  }
};
```

### 4. Services (`app/domain/llm/services.ts`)

The LlmService will act as a facade that wraps and hides the provider-specific API client implementations:

```typescript
export const LlmService = {
  async sendPrompt(config: LlmConfig, prompt: LlmPrompt): Promise<LlmResponse> {
    switch (config.provider) {
      case "anthropic":
        return await sendToAnthropic(config, prompt);
      case "openai":
        return await sendToOpenAI(config, prompt);
      // Other providers...
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }
};

// Provider-specific implementations hidden as private functions
async function sendToAnthropic(config: LlmConfig, prompt: LlmPrompt): Promise<LlmResponse> {
  // Implementation for Anthropic Claude API
}

async function sendToOpenAI(config: LlmConfig, prompt: LlmPrompt): Promise<LlmResponse> {
  // Implementation for OpenAI API
}
```

## Consequences

### Positive

1. **Abstraction of Provider APIs**: The domain services interact with a consistent interface (LlmService) regardless of the underlying LLM provider, making it easier to switch providers or support multiple providers.

2. **Improved Maintainability**: Changes to provider APIs are isolated to the provider-specific implementation functions, limiting the impact on the rest of the application.

3. **Separation of Concerns**: The LLM domain is responsible only for LLM interactions, while the modeling domain focuses on domain modeling logic.

4. **Client-Side Security**: API keys are stored locally in the user's browser and sent directly to the LLM provider, avoiding the need for a server to handle sensitive credentials.

5. **Flexibility**: The design supports adding new LLM providers with minimal changes to the codebase.

### Negative

1. **Client-Side Performance**: LLM API calls from the client may introduce latency, especially for complex prompts.

2. **Browser Limitations**: The application is subject to browser limitations for API calls and local storage.

3. **Dependency on External APIs**: The application depends on the availability and stability of third-party LLM APIs.

### Risks and Mitigations

1. **Risk**: LLM provider APIs may change, breaking the integration.
   - **Mitigation**: Isolate provider-specific code in private functions, making updates easier to implement.

2. **Risk**: Different providers have different capabilities and response formats.
   - **Mitigation**: Normalize responses in the provider-specific functions to ensure a consistent interface.

3. **Risk**: API keys stored in the browser may be vulnerable.
   - **Mitigation**: Use encryption for stored API keys and implement proper security measures.

## Implementation Notes

1. We will need to add dependencies for the LLM provider APIs (e.g., @anthropic-ai/sdk for Anthropic).

2. The LlmService should include error handling and retry logic for API failures.

3. We should implement a mechanism to validate API keys before saving them.

4. The LlmPromptFactory should include templates for different domain modeling tasks.

5. We should consider implementing a caching mechanism to reduce API calls for repeated prompts.
