/**
 * Serialized access to process.chdir(). Only one withCwd block
 * runs at a time, preventing concurrent directory corruption.
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
