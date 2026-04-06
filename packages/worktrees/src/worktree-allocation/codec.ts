import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type {
  WorktreeAllocation,
  WorktreeReleaseResult,
  WorktreeSyncResult,
} from './types.js';

export const WorktreeAllocationCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  taskId: t.string,
  branchName: t.string,
  worktreePath: t.string,
});

export const WorktreeSyncResultCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  taskId: t.string,
  branchName: t.string,
  worktreePath: t.string,
  baseBranch: t.string,
  syncMode: t.union([t.literal('fast-forward'), t.literal('rebase')]),
  changed: t.boolean,
  conflictsDetected: t.boolean,
});

export const WorktreeReleaseResultCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  taskId: t.string,
  branchName: t.string,
  worktreePath: t.string,
  releaseMode: t.union([t.literal('archive'), t.literal('delete')]),
  released: t.boolean,
});

export type _WorktreeAllocationExact = Exact<
  WorktreeAllocation,
  t.TypeOf<typeof WorktreeAllocationCodec>
>;

export type _WorktreeSyncResultExact = Exact<
  WorktreeSyncResult,
  t.TypeOf<typeof WorktreeSyncResultCodec>
>;

export type _WorktreeReleaseResultExact = Exact<
  WorktreeReleaseResult,
  t.TypeOf<typeof WorktreeReleaseResultCodec>
>;
