import { defineConfig } from "vitest/config";

// Deliberately not extending vite.config.ts: these are pure-logic tests with no
// DOM, so the React plugin, SVGR and the dev-server proxy are all dead weight.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
