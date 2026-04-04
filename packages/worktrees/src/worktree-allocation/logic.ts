import { appendTrace } from '@vannadii/devplat-core';

import type { WorktreeAllocation } from './types.js';

export function createWorktreeAllocation(
  input: WorktreeAllocation,
): WorktreeAllocation {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `worktree:${input.taskId}:${input.branchName}`,
  );
}

export function allocateWorktree(
  taskId: string,
  branchName: string,
  worktreeRoot = '.worktrees',
): WorktreeAllocation {
  return createWorktreeAllocation({
    id: `worktree-${taskId}`,
    summary: `Allocated worktree for ${taskId}`,
    status: 'approved',
    trace: [],
    updatedAt: new Date().toISOString(),
    taskId,
    branchName,
    worktreePath: `${worktreeRoot}/${branchName}`,
  });
}

export function describeWorktreeAllocation(input: WorktreeAllocation): string {
  return `${input.branchName} -> ${input.worktreePath}`;
}
