import { describe, expect, it } from 'vitest';

import { TaskQueueService } from './service.js';

describe('TaskQueueService', () => {
  it('claims and updates tasks through the service shell', () => {
    const service = new TaskQueueService();
    const task = service.execute({
      id: 'queue-001',
      summary: 'queue record',
      status: 'queued',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      taskId: 'task-1',
      sliceId: 'slice-1',
      threadId: 'thread-1',
    });

    const claimed = service.claim(task, 'worker-1');
    const running = service.updateStatus(claimed, 'running');

    expect(claimed.assigneeId).toBe('worker-1');
    expect(running.status).toBe('running');
    expect(service.explain(running)).toContain('task-1:running');
  });
});
