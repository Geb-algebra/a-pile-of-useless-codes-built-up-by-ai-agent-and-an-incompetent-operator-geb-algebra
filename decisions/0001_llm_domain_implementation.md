# ADR 0001: LLM Domain Implementation

## Status

Updated

## Context

The Domain Modeler application needs to integrate with Large Language Models (LLMs) to implement the business logic for domain modeling. The application follows a client-only approach where API keys for LLM providers are passed directly to the service methods when needed.

Key requirements:

1. Support Anthropic as the LLM provider
2. Client-side implementation with no server component
3. Secure handling of API keys
4. Consistent interface for domain services to interact with LLMs
5. Maintainable code that can adapt to API changes from providers

## Decision

We will implement a dedicated LLM domain with the following components:

### 1. Models (`app/domain/llm/models.ts`)

```typescript
export type LlmModel = {
  modelName: string;
  contextWindow: number;
  capabilities: string[];
};

export type LlmConfig = {
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
  create(model: string, temperature = 0.7, maxTokens = 2000): LlmConfig {
    // Validation logic
    return { model, temperature, maxTokens };
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
    // Save configuration to localforage
  },
  
  async get(): Promise<LlmConfig | null> {
    // Get configuration from localforage
  }
};
```

### 4. Services (`app/domain/llm/services.ts`)

The LlmService will accept the API key as an argument for each method that requires it:

```typescript
export const LlmService = {
  async sendPrompt(config: LlmConfig, prompt: LlmPrompt, apiKey: string): Promise<LlmResponse> {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    return await sendToAnthropic(config, prompt, apiKey);
  },
  
  async getAvailableModels(apiKey: string): Promise<string[]> {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    return await getAnthropicModels(apiKey);
  }
};

// Provider-specific implementations hidden as private functions
async function sendToAnthropic(config: LlmConfig, prompt: LlmPrompt, apiKey: string): Promise<LlmResponse> {
  // Implementation for Anthropic Claude API
}

async function getAnthropicModels(apiKey: string): Promise<string[]> {
  // Implementation for Anthropic models
}
```

## Consequences

### Positive

1. **Improved Security**: API keys are not stored in the browser's local storage, reducing risks of key exposure.

2. **Explicit API Key Handling**: Each service method explicitly requires the API key, making the dependency clear.

3. **Simplified Implementation**: The implementation focuses on a single provider (Anthropic), making it more straightforward.

4. **Separation of Concerns**: The LLM domain is responsible only for LLM interactions, while the modeling domain focuses on domain modeling logic.

5. **Flexibility**: The design allows API keys to be managed by the application in various ways.

### Negative

1. **Client-Side Performance**: LLM API calls from the client may introduce latency, especially for complex prompts.

2. **Browser Limitations**: The application is subject to browser limitations for API calls.

3. **Dependency on External APIs**: The application depends on the availability and stability of the Anthropic API.

### Risks and Mitigations

1. **Risk**: Anthropic API may change, breaking the integration.
   - **Mitigation**: Isolate provider-specific code in private functions, making updates easier to implement.

2. **Risk**: API keys passed through function arguments may be exposed in stack traces or logs.
   - **Mitigation**: Implement proper error handling to prevent API keys from appearing in logs or stack traces.

## Implementation Notes

1. We will focus on supporting Anthropic's Claude API.

2. The LlmService should include error handling and retry logic for API failures.

3. We should implement a mechanism to validate API keys before using them.

4. The LlmPromptFactory should include templates for different domain modeling tasks.

5. We should consider implementing a caching mechanism to reduce API calls for repeated prompts.
