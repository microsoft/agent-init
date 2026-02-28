import { render } from "ink";
import React from "react";

import { getGitHubToken } from "../services/github";
import { parsePolicySources } from "../services/policy";
import { BatchReadinessTui } from "../ui/BatchReadinessTui";
import { outputError } from "../utils/output";

type BatchReadinessOptions = {
  output?: string;
  policy?: string;
  json?: boolean;
  quiet?: boolean;
  accessible?: boolean;
};

export async function batchReadinessCommand(options: BatchReadinessOptions): Promise<void> {
  const token = await getGitHubToken();
  if (!token) {
    outputError(
      "GitHub authentication required. Install and authenticate GitHub CLI (gh auth login) or set GITHUB_TOKEN.",
      Boolean(options.json)
    );
    return;
  }

  try {
    const policies = parsePolicySources(options.policy);
    const { waitUntilExit } = render(
      <BatchReadinessTui token={token} outputPath={options.output} policies={policies} />,
      { isScreenReaderEnabled: Boolean(options.accessible) }
    );
    await waitUntilExit();
  } catch (error) {
    outputError(
      `TUI failed: ${error instanceof Error ? error.message : String(error)}`,
      Boolean(options.json)
    );
  }
}
