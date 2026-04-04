import {
  allocateWorktree,
  createWorktreeAllocation,
  describeWorktreeAllocation,
} from './logic.js';
import type { WorktreeAllocation } from './types.js';

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
}
