import * as t from 'io-ts';

import type {
  AllocateWorktreeToolInput,
  ClaimTaskToolInput,
  RunGatesToolInput,
  RunSupervisorStepToolInput,
  UpdateTaskToolInput,
  ValidateArtifactToolInput,
} from './types.js';

export const RunGatesToolInputCodec: t.Type<RunGatesToolInput> = t.type({
  gateNames: t.array(t.string),
  summary: t.string,
});

export const AllocateWorktreeToolInputCodec: t.Type<AllocateWorktreeToolInput> =
  t.type({
    taskId: t.string,
    branchName: t.string,
  });

export const ClaimTaskToolInputCodec: t.Type<ClaimTaskToolInput> = t.type({
  taskId: t.string,
  sliceId: t.string,
  threadId: t.string,
  assigneeId: t.string,
});

export const UpdateTaskToolInputCodec: t.Type<UpdateTaskToolInput> = t.type({
  taskId: t.string,
  sliceId: t.string,
  threadId: t.string,
  status: t.union([
    t.literal('review'),
    t.literal('blocked'),
    t.literal('approved'),
    t.literal('merge-ready'),
    t.literal('merged'),
    t.literal('failed'),
    t.literal('rebasing'),
    t.literal('complete'),
  ]),
}) as t.Type<UpdateTaskToolInput>;

export const ValidateArtifactToolInputCodec: t.Type<ValidateArtifactToolInput> =
  t.type({
    artifact: t.UnknownRecord,
  });

export const RunSupervisorStepToolInputCodec: t.Type<RunSupervisorStepToolInput> =
  t.type({
    action: t.string,
    actorId: t.string,
    privileged: t.boolean,
  });
