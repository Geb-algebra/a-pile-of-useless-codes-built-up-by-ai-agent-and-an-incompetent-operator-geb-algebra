import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../../mocks/mock-server";

// Set MOCKS environment variable for tests
process.env.MOCKS = "true";

// Setup server before all tests
beforeAll(() => {
	server.listen({ onUnhandledRequest: "warn" });
	console.info("🔶 MSW Test Server Started");
});

// Reset handlers after each test
afterEach(() => {
	server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
	server.close();
	console.info("🔶 MSW Test Server Stopped");
});
