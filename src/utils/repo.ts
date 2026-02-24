/** owner/name — rejects . and .. as segments */
export const GITHUB_REPO_RE = /^(?!\.{1,2}\/)([a-zA-Z0-9._-]+)\/(?!\.{1,2}$)([a-zA-Z0-9._-]+)$/;

/** org/project/repo — rejects . and .. as segments */
export const AZURE_REPO_RE =
  /^(?!\.{1,2}\/)([a-zA-Z0-9._-]+)\/(?!\.{1,2}\/)([a-zA-Z0-9._-]+)\/(?!\.{1,2}$)([a-zA-Z0-9._-]+)$/;
