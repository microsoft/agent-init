import fs from "fs/promises";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";

import { analyzeRepo } from "../analyzer";

describe("analyzeRepo", () => {
  it("detects TypeScript and npm workspace", async () => {
    const repoPath = await fs.mkdtemp(path.join(os.tmpdir(), "primer-test-"));
    const packageJson = {
      name: "demo",
      workspaces: ["packages/*"],
      dependencies: { react: "^19.0.0" }
    };

    await fs.writeFile(path.join(repoPath, "package.json"), JSON.stringify(packageJson, null, 2));
    await fs.writeFile(path.join(repoPath, "tsconfig.json"), "{}", "utf8");
    await fs.mkdir(path.join(repoPath, "packages", "app"), { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "packages", "app", "package.json"),
      JSON.stringify({ name: "app", scripts: { build: "tsc" } }, null, 2)
    );

    const result = await analyzeRepo(repoPath);

    expect(result.languages).toContain("TypeScript");
    expect(result.workspaceType).toBe("npm");
    expect(result.apps?.length).toBe(1);
  });
});
