import path from "path";

import { render } from "ink";
import React from "react";

import { PrimerTui } from "../ui/tui";

type TuiOptions = {
  repo?: string;
  animation?: boolean;
  json?: boolean;
  quiet?: boolean;
};

export async function tuiCommand(options: TuiOptions): Promise<void> {
  const repoPath = path.resolve(options.repo ?? process.cwd());
  const skipAnimation = options.animation === false;
  const { waitUntilExit } = render(<PrimerTui repoPath={repoPath} skipAnimation={skipAnimation} />);
  await waitUntilExit();
}
