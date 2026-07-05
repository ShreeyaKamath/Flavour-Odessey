import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: true
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      "@flavor/contracts": new URL("../shared/contracts", import.meta.url).pathname
    }
  }
});
