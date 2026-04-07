import * as t from 'io-ts';

import { PullRequestRecordCodec } from '@vannadii/devplat-prs';
import {
  WorktreeSyncModeCodec,
  WorktreeSyncResultCodec,
} from '@vannadii/devplat-worktrees';

import type {
  ExecuteRebaseDependentsInput,
  RebaseExecutionResult,
  RebasePlan,
} from './types.js';

export const RebasePlanCodec = t.type({
  mergedPrNumber: t.number,
  baseBranch: t.string,
  dependentBranches: t.array(t.string),
  rebaseRequired: t.boolean,
  conflictsExpected: t.boolean,
  updatedAt: t.string,
});

export const ExecuteRebaseDependentsInputCodec = t.intersection([
  t.type({
    record: PullRequestRecordCodec,
    dependentBranches: RebasePlanCodec.props.dependentBranches,
  }),
  t.partial({
    syncMode: WorktreeSyncModeCodec,
  }),
]);

export const RebaseExecutionResultCodec = t.type({
  plan: RebasePlanCodec,
  syncMode: WorktreeSyncModeCodec,
  syncResults: t.array(WorktreeSyncResultCodec),
  executed: t.boolean,
  conflictsDetected: t.boolean,
});

export type _RebasePlanExact =
  t.TypeOf<typeof RebasePlanCodec> extends RebasePlan
    ? RebasePlan extends t.TypeOf<typeof RebasePlanCodec>
      ? true
      : never
    : never;

export type _ExecuteRebaseDependentsInputExact =
  t.TypeOf<
    typeof ExecuteRebaseDependentsInputCodec
  > extends ExecuteRebaseDependentsInput
    ? ExecuteRebaseDependentsInput extends t.TypeOf<
        typeof ExecuteRebaseDependentsInputCodec
      >
      ? true
      : never
    : never;

export type _RebaseExecutionResultExact =
  t.TypeOf<typeof RebaseExecutionResultCodec> extends RebaseExecutionResult
    ? RebaseExecutionResult extends t.TypeOf<typeof RebaseExecutionResultCodec>
      ? true
      : never
    : never;
