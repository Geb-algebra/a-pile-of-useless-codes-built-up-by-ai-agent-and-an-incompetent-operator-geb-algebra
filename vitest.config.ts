/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		include: ["./app/**/*.test.{ts,tsx}"],
		globals: true,
		environment: "happy-dom",
		restoreMocks: true,
		sequence: {
			shuffle: true,
		},
		setupFiles: ["./app/test/setup-tests.ts"],
	},
});
