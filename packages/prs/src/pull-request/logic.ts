import type { PullRequestRecord } from './types.js';

export function createPullRequestRecord(
  input: PullRequestRecord,
): PullRequestRecord {
  return {
    ...input,
    branchName: input.branchName.trim(),
    baseBranch: input.baseBranch.trim(),
    title: input.title.trim(),
    labels: [
      ...new Set(input.labels.map((label) => label.trim()).filter(Boolean)),
    ],
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function canMergePullRequest(input: PullRequestRecord): boolean {
  return input.mergeReady && input.reviewState === 'approved';
}

export function describePullRequestRecord(input: PullRequestRecord): string {
  return `PR #${String(input.prNumber)} -> ${input.title}`;
}
