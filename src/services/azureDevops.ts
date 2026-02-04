type AzureDevOpsProfileResponse = {
  id: string;
  displayName: string;
};

type AzureDevOpsAccountResponse = {
  accountId: string;
  accountName: string;
  accountUri: string;
};

type AzureDevOpsListResponse<T> = {
  value: T[];
};

type AzureDevOpsProjectResponse = {
  id: string;
  name: string;
  url: string;
};

type AzureDevOpsRepoResponse = {
  id: string;
  name: string;
  webUrl: string;
  remoteUrl: string;
  isPrivate: boolean;
  defaultBranch?: string;
  project?: {
    id: string;
    name: string;
  };
};

export type AzureDevOpsOrg = {
  id: string;
  name: string;
  url: string;
};

export type AzureDevOpsProject = {
  id: string;
  name: string;
  organization: string;
  url: string;
};

export type AzureDevOpsRepo = {
  id: string;
  name: string;
  organization: string;
  project: string;
  projectId: string;
  webUrl: string;
  cloneUrl: string;
  isPrivate: boolean;
  defaultBranch: string;
  hasInstructions?: boolean;
};

const PROFILE_URL = "https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=7.1-preview.1";

function getAuthHeader(token: string): string {
  const encoded = Buffer.from(`:${token}`).toString("base64");
  return `Basic ${encoded}`;
}

async function adoRequest<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(token),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Azure DevOps request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

export function getAzureDevOpsToken(): string | null {
  return process.env.AZURE_DEVOPS_PAT ?? process.env.AZDO_PAT ?? null;
}

export async function listOrganizations(token: string): Promise<AzureDevOpsOrg[]> {
  const profile = await adoRequest<AzureDevOpsProfileResponse>(PROFILE_URL, token);
  const accountsUrl = `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${profile.id}&api-version=7.1-preview.1`;
  const accounts = await adoRequest<AzureDevOpsListResponse<AzureDevOpsAccountResponse>>(accountsUrl, token);

  return accounts.value.map((account) => ({
    id: account.accountId,
    name: account.accountName,
    url: account.accountUri
  }));
}

export async function listProjects(token: string, organization: string): Promise<AzureDevOpsProject[]> {
  const url = `https://dev.azure.com/${organization}/_apis/projects?stateFilter=wellFormed&api-version=7.1-preview.1`;
  const response = await adoRequest<AzureDevOpsListResponse<AzureDevOpsProjectResponse>>(url, token);

  return response.value.map((project) => ({
    id: project.id,
    name: project.name,
    organization,
    url: project.url
  }));
}

export async function listRepos(token: string, organization: string, project: string): Promise<AzureDevOpsRepo[]> {
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.1-preview.1`;
  const response = await adoRequest<AzureDevOpsListResponse<AzureDevOpsRepoResponse>>(url, token);

  return response.value.map((repo) => ({
    id: repo.id,
    name: repo.name,
    organization,
    project,
    projectId: repo.project?.id ?? "",
    webUrl: repo.webUrl,
    cloneUrl: repo.remoteUrl,
    isPrivate: repo.isPrivate,
    defaultBranch: repo.defaultBranch ?? "refs/heads/main"
  }));
}

export async function getRepo(
  token: string,
  organization: string,
  project: string,
  repo: string
): Promise<AzureDevOpsRepo> {
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repo}?api-version=7.1-preview.1`;
  const response = await adoRequest<AzureDevOpsRepoResponse>(url, token);

  return {
    id: response.id,
    name: response.name,
    organization,
    project,
    projectId: response.project?.id ?? "",
    webUrl: response.webUrl,
    cloneUrl: response.remoteUrl,
    isPrivate: response.isPrivate,
    defaultBranch: response.defaultBranch ?? "refs/heads/main"
  };
}

function toRefName(branch: string): string {
  if (branch.startsWith("refs/")) return branch;
  return `refs/heads/${branch}`;
}

export async function createPullRequest(params: {
  token: string;
  organization: string;
  project: string;
  repoId: string;
  repoName: string;
  title: string;
  body: string;
  sourceBranch: string;
  targetBranch: string;
}): Promise<string> {
  const url = `https://dev.azure.com/${params.organization}/${params.project}/_apis/git/repositories/${params.repoId}/pullrequests?api-version=7.1-preview.1`;
  const payload = {
    title: params.title,
    description: params.body,
    sourceRefName: toRefName(params.sourceBranch),
    targetRefName: toRefName(params.targetBranch)
  };

  const response = await adoRequest<{ pullRequestId: number }>(url, params.token, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return `https://dev.azure.com/${params.organization}/${params.project}/_git/${encodeURIComponent(
    params.repoName
  )}/pullrequest/${response.pullRequestId}`;
}

export async function checkRepoHasInstructions(
  token: string,
  organization: string,
  project: string,
  repoId: string
): Promise<boolean> {
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repoId}/items?path=/.github/copilot-instructions.md&includeContentMetadata=true&api-version=7.1-preview.1`;
  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(token)
    }
  });

  if (response.status === 404) {
    return false;
  }

  return response.ok;
}

export async function checkReposForInstructions(
  token: string,
  repos: AzureDevOpsRepo[],
  onProgress?: (checked: number, total: number) => void
): Promise<AzureDevOpsRepo[]> {
  const concurrency = 10;
  const results: AzureDevOpsRepo[] = [];
  let checked = 0;

  for (let i = 0; i < repos.length; i += concurrency) {
    const batch = repos.slice(i, i + concurrency);
    const checks = await Promise.all(
      batch.map(async (repo) => {
        const hasInstructions = await checkRepoHasInstructions(
          token,
          repo.organization,
          repo.project,
          repo.id
        );
        return { ...repo, hasInstructions };
      })
    );
    results.push(...checks);
    checked += batch.length;
    onProgress?.(checked, repos.length);
  }

  return results;
}