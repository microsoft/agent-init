import * as esbuild from "esbuild";
import { readFile } from "node:fs/promises";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * esbuild plugin: neutralise the SDK's getBundledCliPath() which calls
 * import.meta.resolve("@github/copilot/sdk"). In CJS bundles esbuild replaces
 * import.meta with {}, making .resolve undefined and crashing at runtime.
 * Primer always passes an explicit cliPath so this function is dead code, but
 * the SDK constructor still evaluates it as a default value.
 */
const shimSdkImportMeta = {
  name: "shim-sdk-import-meta",
  setup(build) {
    build.onLoad({ filter: /copilot-sdk[\\/]dist[\\/]client\.js$/ }, async (args) => {
      let contents = await readFile(args.path, "utf8");
      // Replace the body of getBundledCliPath with a safe no-op return.
      // The function signature and surrounding code stay intact.
      contents = contents.replace(
        'const sdkUrl = import.meta.resolve("@github/copilot/sdk");\n  const sdkPath = fileURLToPath(sdkUrl);\n  return join(dirname(dirname(sdkPath)), "index.js");',
        'return "bundled-cli-unavailable";'
      );
      return { contents, loader: "js" };
    });
  }
};

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node22",
  outfile: "out/extension.js",
  // Keep Copilot SDK bundled: packaged extensions may not have node_modules at runtime.
  external: ["vscode"],
  sourcemap: !production,
  minify: production,
  plugins: [shimSdkImportMeta],
  alias: {
    // Resolve Primer source imports via the parent src/ directory
    primer: "../src"
  }
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await esbuild.build(buildOptions);
    console.log(production ? "Production build complete." : "Build complete.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
