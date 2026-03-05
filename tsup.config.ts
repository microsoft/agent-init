import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  banner: {
    js: "#!/usr/bin/env node"
  },
  // Keep node_modules as external — they'll be installed via npm
  external: [/^[^./]/],
  // Bundle the workspace package inline (source .ts files, not published)
  noExternal: [/@agentrc\/core/],
  esbuildOptions(options) {
    options.jsx = "automatic";
    // Resolve @agentrc/core subpath imports to source files
    options.alias = {
      "@agentrc/core": "./packages/core/src"
    };
  }
});
