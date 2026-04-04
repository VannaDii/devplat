export type PullRequestReviewState =
  | 'draft'
  | 'review'
  | 'approved'
  | 'changes-requested';

export interface PullRequestRecord {
  prNumber: number;
  branchName: string;
  baseBranch: string;
  title: string;
  labels: string[];
  reviewState: PullRequestReviewState;
  mergeReady: boolean;
  updatedAt: string;
}
