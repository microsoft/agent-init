import React from "react";
import { render } from "ink";
import { BatchTui } from "../ui/BatchTui";
import { getGitHubToken } from "../services/github";
import { BatchTuiAzure } from "../ui/BatchTuiAzure";
import { getAzureDevOpsToken } from "../services/azureDevops";

type BatchOptions = {
  output?: string;
  provider?: string;
};

export async function batchCommand(options: BatchOptions): Promise<void> {
  const provider = options.provider ?? "github";
  if (provider !== "github" && provider !== "azure") {
    console.error("Invalid provider. Use github or azure.");
    process.exitCode = 1;
    return;
  }

  if (provider === "azure") {
    const token = getAzureDevOpsToken();
    if (!token) {
      console.error("Error: Azure DevOps authentication required.");
      console.error("");
      console.error("Set a PAT environment variable:");
      console.error("  export AZURE_DEVOPS_PAT=<your-pat>");
      process.exitCode = 1;
      return;
    }

    const { waitUntilExit } = render(
      <BatchTuiAzure token={token} outputPath={options.output} />
    );
    await waitUntilExit();
    return;
  }

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
    <BatchTui token={token} outputPath={options.output} />
  );


  await waitUntilExit();
}
