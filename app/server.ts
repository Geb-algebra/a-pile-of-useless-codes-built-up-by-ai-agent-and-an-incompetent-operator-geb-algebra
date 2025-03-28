import { Hono } from "hono";
import { env } from "hono/adapter";

export type Env = { Variables: { LLM_API_KEY: string } };

if (process?.env?.NODE_ENV === "development" && process?.env?.MOCKS === "true") {
	await import("../mocks/index.ts");
}

const app = new Hono<Env>();

app.use(async (c, next) => {
	const { LLM_API_KEY } = env<{ LLM_API_KEY: string }>(c);
	c.set("LLM_API_KEY", LLM_API_KEY);
	await next();
});

export default app;
