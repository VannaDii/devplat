import type { GitHubActionRequest } from './types.js';

export function createGitHubActionRequest(
  input: GitHubActionRequest,
): GitHubActionRequest {
  const branchName = input.branchName?.trim();

  return {
    ...input,
    repoFullName: input.repoFullName.trim(),
    summary: input.summary.trim(),
    updatedAt: new Date(input.updatedAt).toISOString(),
    ...(branchName ? { branchName } : {}),
  };
}

export function isPrivilegedGitHubAction(input: GitHubActionRequest): boolean {
  return input.privileged || input.action === 'merge-pr';
}

export function describeGitHubActionRequest(
  input: GitHubActionRequest,
): string {
  return `${input.action} -> ${input.repoFullName}`;
}
