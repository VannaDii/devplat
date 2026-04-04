import { describe, expect, it } from 'vitest';

import { allocateWorktree } from './logic.js';

describe('WorktreeAllocation logic', () => {
  it('allocates a deterministic worktree path', () => {
    const allocation = allocateWorktree('task-1', 'feature/task-1');
    expect(allocation.worktreePath).toContain('feature/task-1');
    expect(allocation.trace).toContain('worktree:task-1:feature/task-1');
  });
});
