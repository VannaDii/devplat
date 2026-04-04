import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface WorktreeAllocation {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  taskId: string;
  branchName: string;
  worktreePath: string;
}
