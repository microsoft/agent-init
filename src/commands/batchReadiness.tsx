import React from "react";
import { render } from "ink";
import { BatchReadinessTui } from "../ui/BatchReadinessTui";
import { getGitHubToken } from "../services/github";

type BatchReadinessOptions = {
  output?: string;
};

export async function batchReadinessCommand(options: BatchReadinessOptions): Promise<void> {
  const token = await getGitHubToken();
  if (!token) {
    console.error("Error: GitHub authentication required.");
    console.error("");
    console.error("Option 1 (recommended): Install and authenticate GitHub CLI");
    console.error("  brew install gh && gh auth login");
    console.error("");
    console.error("Option 2: Set a token environment variable");
    console.error("  export GITHUB_TOKEN=<your-token>");
    process.exitCode = 1;
    return;
  }

  const { waitUntilExit } = render(
    <BatchReadinessTui token={token} outputPath={options.output} />
  );

  await waitUntilExit();
}
