import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { TaskRecord } from './types.js';

export const TaskRecordCodec = t.intersection([
  t.type({
    id: t.string,
    summary: t.string,
    status: LifecycleStatusCodec,
    trace: t.array(t.string),
    updatedAt: t.string,
    taskId: t.string,
    sliceId: t.string,
    threadId: t.string,
  }),
  t.partial({
    assigneeId: t.string,
  }),
]);

export type _TaskRecordExact = Exact<
  TaskRecord,
  t.TypeOf<typeof TaskRecordCodec>
>;
