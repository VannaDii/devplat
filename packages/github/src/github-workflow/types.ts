export type GitHubAction =
  | 'create-pr'
  | 'update-pr'
  | 'comment-pr'
  | 'merge-pr'
  | 'sync-branch';

export interface GitHubActionRequest {
  repoFullName: string;
  action: GitHubAction;
  summary: string;
  privileged: boolean;
  targetNumber?: number;
  branchName?: string;
  updatedAt: string;
}

export interface GitHubActionDecision {
  request: GitHubActionRequest;
  allowed: boolean;
  policyDecisionId: string;
}
