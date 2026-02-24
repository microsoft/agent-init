import path from "path";

import { render } from "ink";
import React from "react";

import { PrimerTui } from "../ui/tui";
import { outputError } from "../utils/output";

type TuiOptions = {
  repo?: string;
  animation?: boolean;
  json?: boolean;
  quiet?: boolean;
};

export async function tuiCommand(options: TuiOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());
  const skipAnimation = options.animation === false;
  try {
    const { waitUntilExit } = render(
      <PrimerTui repoPath={repoPath} skipAnimation={skipAnimation} />
    );
    await waitUntilExit();
  } catch (error) {
    outputError(`TUI failed: ${error instanceof Error ? error.message : String(error)}`, false);
  }
}
