import { appendTrace } from '@vannadii/devplat-core';

import type {
  WorktreeAllocation,
  WorktreeReleaseMode,
  WorktreeReleaseResult,
  WorktreeSyncMode,
  WorktreeSyncResult,
} from './types.js';

function trimWorktreeValue(value: string): string {
  return value.trim();
}

export function createWorktreeAllocation(
  input: WorktreeAllocation,
): WorktreeAllocation {
  const taskId = trimWorktreeValue(input.taskId);
  const branchName = trimWorktreeValue(input.branchName);
  const worktreePath = trimWorktreeValue(input.worktreePath);

  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
      taskId,
      branchName,
      worktreePath,
    },
    `worktree:${taskId}:${branchName}`,
  );
}

export function allocateWorktree(
  taskId: string,
  branchName: string,
  worktreeRoot = '.worktrees',
): WorktreeAllocation {
  const normalizedTaskId = trimWorktreeValue(taskId);
  const normalizedBranchName = trimWorktreeValue(branchName);
  const normalizedWorktreeRoot = trimWorktreeValue(worktreeRoot);

  return createWorktreeAllocation({
    id: `worktree-${normalizedTaskId}`,
    summary: `Allocated worktree for ${normalizedTaskId}`,
    status: 'approved',
    trace: [],
    updatedAt: new Date().toISOString(),
    taskId: normalizedTaskId,
    branchName: normalizedBranchName,
    worktreePath: `${normalizedWorktreeRoot}/${normalizedBranchName}`,
  });
}

export function describeWorktreeAllocation(input: WorktreeAllocation): string {
  return `${input.branchName} -> ${input.worktreePath}`;
}

export function createWorktreeSyncResult(
  input: WorktreeSyncResult,
): WorktreeSyncResult {
  const taskId = trimWorktreeValue(input.taskId);
  const branchName = trimWorktreeValue(input.branchName);

  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      baseBranch: input.baseBranch.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
      taskId,
      branchName,
      worktreePath: trimWorktreeValue(input.worktreePath),
    },
    `worktree:sync:${taskId}:${branchName}:${input.syncMode}`,
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
  const taskId = trimWorktreeValue(input.taskId);
  const branchName = trimWorktreeValue(input.branchName);

  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
      taskId,
      branchName,
      worktreePath: trimWorktreeValue(input.worktreePath),
    },
    `worktree:release:${taskId}:${branchName}:${input.releaseMode}`,
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
