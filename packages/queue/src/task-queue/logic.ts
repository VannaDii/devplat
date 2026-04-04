import { appendTrace, type LifecycleStatus } from '@vannadii/devplat-core';

import type { TaskRecord } from './types.js';

export function createTaskRecord(input: TaskRecord): TaskRecord {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `queue:${input.taskId}:${input.status}`,
  );
}

export function claimTask(record: TaskRecord, assigneeId: string): TaskRecord {
  return createTaskRecord({
    ...record,
    status: 'claimed',
    assigneeId,
  });
}

export function updateTaskStatus(
  record: TaskRecord,
  status: LifecycleStatus,
): TaskRecord {
  return createTaskRecord({
    ...record,
    status,
  });
}

export function describeTaskRecord(input: TaskRecord): string {
  return `${input.taskId}:${input.status} -> ${input.summary}`;
}
