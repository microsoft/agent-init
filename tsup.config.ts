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
  esbuildOptions(options) {
    options.jsx = "automatic";
  }
});
