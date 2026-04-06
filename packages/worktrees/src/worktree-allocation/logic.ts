import { appendTrace } from '@vannadii/devplat-core';

import type {
  WorktreeAllocation,
  WorktreeReleaseMode,
  WorktreeReleaseResult,
  WorktreeSyncMode,
  WorktreeSyncResult,
} from './types.js';

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

export function createWorktreeSyncResult(
  input: WorktreeSyncResult,
): WorktreeSyncResult {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      baseBranch: input.baseBranch.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `worktree:sync:${input.taskId}:${input.branchName}:${input.syncMode}`,
  );
}

export function syncWorktree(
  allocation: WorktreeAllocation,
  baseBranch: string,
  syncMode: WorktreeSyncMode = 'rebase',
): WorktreeSyncResult {
  const normalized = createWorktreeAllocation(allocation);

  return createWorktreeSyncResult({
    id: `${normalized.id}:sync:${syncMode}`,
    summary: `Synced worktree for ${normalized.branchName}`,
    status: 'complete',
    trace: [...normalized.trace],
    updatedAt: new Date().toISOString(),
    taskId: normalized.taskId,
    branchName: normalized.branchName,
    worktreePath: normalized.worktreePath,
    baseBranch,
    syncMode,
    changed: true,
    conflictsDetected: false,
  });
}

export function createWorktreeReleaseResult(
  input: WorktreeReleaseResult,
): WorktreeReleaseResult {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `worktree:release:${input.taskId}:${input.branchName}:${input.releaseMode}`,
  );
}

export function releaseWorktree(
  allocation: WorktreeAllocation,
  releaseMode: WorktreeReleaseMode = 'archive',
): WorktreeReleaseResult {
  const normalized = createWorktreeAllocation(allocation);

  return createWorktreeReleaseResult({
    id: `${normalized.id}:release:${releaseMode}`,
    summary: `Released worktree for ${normalized.branchName}`,
    status: 'complete',
    trace: [...normalized.trace],
    updatedAt: new Date().toISOString(),
    taskId: normalized.taskId,
    branchName: normalized.branchName,
    worktreePath: normalized.worktreePath,
    releaseMode,
    released: true,
  });
}
