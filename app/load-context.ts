import type { Context } from "hono";
// load-context.ts
import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";
import type { Env } from "./server";

type Cloudflare = Omit<PlatformProxy, "dispose">;

declare module "react-router" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		hono: {
			context: Context<Env>;
		};
	}
}

// biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
export {};
