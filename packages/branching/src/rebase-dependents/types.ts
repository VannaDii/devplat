import type { PullRequestRecord } from '@vannadii/devplat-prs';
import type {
  WorktreeSyncMode,
  WorktreeSyncResult,
} from '@vannadii/devplat-worktrees';

export interface RebasePlan {
  mergedPrNumber: number;
  baseBranch: string;
  dependentBranches: string[];
  rebaseRequired: boolean;
  conflictsExpected: boolean;
  updatedAt: string;
}

export interface ExecuteRebaseDependentsInput {
  record: PullRequestRecord;
  dependentBranches: RebasePlan['dependentBranches'];
  syncMode?: WorktreeSyncMode;
}

export interface RebaseExecutionResult {
  plan: RebasePlan;
  syncMode: WorktreeSyncMode;
  syncResults: WorktreeSyncResult[];
  executed: boolean;
  conflictsDetected: boolean;
}
