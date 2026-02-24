import type * as vscode from "vscode";
import type { ProgressReporter } from "primer/utils/output.js";

/**
 * Adapts VS Code's `Progress<{ message, increment }>` to Primer's `ProgressReporter` interface.
 */
export class VscodeProgressReporter implements ProgressReporter {
  constructor(
    private readonly progress: vscode.Progress<{ message?: string; increment?: number }>
  ) {}

  update(message: string): void {
    this.progress.report({ message });
  }

  succeed(message: string): void {
    this.progress.report({ message: `✓ ${message}` });
  }

  fail(message: string): void {
    this.progress.report({ message: `✗ ${message}` });
  }

  done(): void {
    // VS Code progress auto-closes when the withProgress callback resolves
  }
}
