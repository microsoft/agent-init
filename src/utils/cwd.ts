/**
 * Serialized access to process.chdir(). Only one withCwd block
 * runs at a time, preventing concurrent directory corruption.
 *
 * WARNING: process.chdir() is a process-global side effect. This lock
 * only serializes concurrent `withCwd` callers. Any other code that
 * resolves relative paths during execution will observe the changed
 * working directory. Use only for Copilot SDK calls that require
 * process.cwd() to be set. Prefer passing `cwd` options to libraries
 * or child processes when available.
 */
let lock: Promise<void> = Promise.resolve();

export function withCwd<T>(dir: string, fn: () => Promise<T>): Promise<T> {
  const previous = lock;
  let release: () => void;
  lock = new Promise<void>((resolve) => {
    release = resolve;
  });

  return previous.then(async () => {
    const original = process.cwd();
    process.chdir(dir);
    try {
      return await fn();
    } finally {
      process.chdir(original);
      release();
    }
  });
}
