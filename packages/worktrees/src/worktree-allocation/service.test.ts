import { describe, expect, it } from 'vitest';

import { WorktreeAllocationService } from './service.js';

describe('WorktreeAllocationService', () => {
  it('allocates worktrees through the service shell', () => {
    const service = new WorktreeAllocationService();
    const allocation = service.allocate('task-1', 'feature/task-1');
    expect(service.explain(allocation)).toContain('feature/task-1');
  });

  it('covers execute for precomputed allocations', () => {
    const service = new WorktreeAllocationService();
    const allocation = service.execute({
      id: 'worktree-task-2',
      summary: '  allocated worktree  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      taskId: 'task-2',
      branchName: 'feature/task-2',
      worktreePath: '.worktrees/feature/task-2',
    });

    expect(allocation.summary).toBe('allocated worktree');
  });
});
