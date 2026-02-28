import path from "path";

import { render } from "ink";
import React from "react";

import { AgentRCTui } from "../ui/tui";
import { outputError } from "../utils/output";

type TuiOptions = {
  repo?: string;
  animation?: boolean;
  json?: boolean;
  quiet?: boolean;
  accessible?: boolean;
};

export async function tuiCommand(options: TuiOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());
  const skipAnimation = options.animation === false;
  try {
    const accessible = Boolean(options.accessible);
    const { waitUntilExit } = render(
      <AgentRCTui repoPath={repoPath} skipAnimation={skipAnimation || accessible} />,
      { isScreenReaderEnabled: accessible }
    );
    await waitUntilExit();
  } catch (error) {
    outputError(`TUI failed: ${error instanceof Error ? error.message : String(error)}`, false);
  }
}
