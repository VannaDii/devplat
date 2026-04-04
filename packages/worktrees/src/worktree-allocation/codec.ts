import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { WorktreeAllocation } from './types.js';

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

export type _WorktreeAllocationExact = Exact<
  WorktreeAllocation,
  t.TypeOf<typeof WorktreeAllocationCodec>
>;
