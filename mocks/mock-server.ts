import { setupServer } from "msw/node";
import { handlers as llmHandlers } from "./llm/handlers";

export const server = setupServer(...llmHandlers);
