/// <reference types="vitest" />
import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: 3000,
		open: true,
	},
	plugins: [ reactPlugin(), tsConfigPaths() ],
	test: {
		testDir: "tests",
		files: "tests/**/*.test.tsx",
		extensions: [ "ts", "tsx" ],
	},
	assetsInclude: [ "**/*.md" ],
});