import { render } from "ink";
import React from "react";

import { getGitHubToken } from "../services/github";
import { outputError } from "../utils/output";
import { BatchReadinessTui } from "../ui/BatchReadinessTui";

type BatchReadinessOptions = {
  output?: string;
  json?: boolean;
  quiet?: boolean;
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

  const { waitUntilExit } = render(<BatchReadinessTui token={token} outputPath={options.output} />);

  await waitUntilExit();
}
