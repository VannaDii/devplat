import {
  allocateWorktree,
  createWorktreeAllocation,
  describeWorktreeAllocation,
  releaseWorktree,
  syncWorktree,
} from './logic.js';
import type {
  WorktreeAllocation,
  WorktreeReleaseMode,
  WorktreeReleaseResult,
  WorktreeSyncMode,
  WorktreeSyncResult,
} from './types.js';

export class WorktreeAllocationService {
  public execute(input: WorktreeAllocation): WorktreeAllocation {
    return createWorktreeAllocation(input);
  }

  public explain(input: WorktreeAllocation): string {
    return describeWorktreeAllocation(input);
  }

  public allocate(taskId: string, branchName: string): WorktreeAllocation {
    return allocateWorktree(taskId, branchName);
  }

  public sync(
    allocation: WorktreeAllocation,
    baseBranch: string,
    syncMode?: WorktreeSyncMode,
  ): WorktreeSyncResult {
    return syncWorktree(allocation, baseBranch, syncMode);
  }

  public release(
    allocation: WorktreeAllocation,
    releaseMode?: WorktreeReleaseMode,
  ): WorktreeReleaseResult {
    return releaseWorktree(allocation, releaseMode);
  }
}
