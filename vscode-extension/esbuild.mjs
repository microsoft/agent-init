import * as esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node22",
  outfile: "out/extension.js",
  external: ["vscode", "@github/copilot-sdk"],
  sourcemap: !production,
  minify: production,
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
