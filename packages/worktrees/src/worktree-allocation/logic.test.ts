import { describe, expect, it } from 'vitest';

import { allocateWorktree, createWorktreeAllocation } from './logic.js';

describe('WorktreeAllocation logic', () => {
  it('allocates a deterministic worktree path', () => {
    const allocation = allocateWorktree('task-1', 'feature/task-1');
    expect(allocation.worktreePath).toContain('feature/task-1');
    expect(allocation.trace).toContain('worktree:task-1:feature/task-1');
  });

  it('trims worktree identity fields before building trace markers', () => {
    const allocation = createWorktreeAllocation({
      id: 'worktree-task-2',
      summary: '  allocated worktree  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      taskId: '  task-2  ',
      branchName: '  feature/task-2  ',
      worktreePath: '  .worktrees/feature/task-2  ',
    });

    expect(allocation.taskId).toBe('task-2');
    expect(allocation.branchName).toBe('feature/task-2');
    expect(allocation.worktreePath).toBe('.worktrees/feature/task-2');
    expect(allocation.trace).toContain('worktree:task-2:feature/task-2');
  });
});
