import { describe, expect, it } from 'vitest';

import {
  claimTask,
  createTaskRecord,
  describeTaskRecord,
  updateTaskStatus,
} from './logic.js';

const baseTask = {
  id: 'queue-001',
  summary: '  queue record  ',
  status: 'queued' as const,
  trace: [],
  updatedAt: '2026-04-04T00:00:00.000Z',
  taskId: 'task-1',
  sliceId: 'slice-1',
  threadId: 'thread-1',
};

describe('TaskRecord logic', () => {
  it('claims a queued task', () => {
    const record = claimTask(createTaskRecord(baseTask), 'worker-1');
    expect(record.status).toBe('claimed');
    expect(record.assigneeId).toBe('worker-1');
  });

  it('updates lifecycle status with trace markers', () => {
    const record = updateTaskStatus(createTaskRecord(baseTask), 'running');
    expect(record.trace).toContain('queue:task-1:running');
    expect(describeTaskRecord(record)).toContain('task-1:running');
  });
});
