import { describe, expect, it } from 'vitest';

import {
  createRebaseExecutionResult,
  createRebasePlan,
  describeRebasePlan,
} from './logic.js';

describe('RebasePlan logic', () => {
  it('normalizes dependent branch lists', () => {
    const snapshot = createRebasePlan({
      mergedPrNumber: 42,
      baseBranch: ' main ',
      dependentBranches: ['feature/a', 'feature/a', 'feature/b'],
      rebaseRequired: false,
      conflictsExpected: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.baseBranch).toBe('main');
    expect(snapshot.dependentBranches).toEqual(['feature/a', 'feature/b']);
    expect(snapshot.rebaseRequired).toBe(true);
    expect(describeRebasePlan(snapshot)).toContain('2 dependents');
  });

  it('keeps rebase optional when no dependents remain', () => {
    const snapshot = createRebasePlan({
      mergedPrNumber: 7,
      baseBranch: ' release ',
      dependentBranches: [' ', ''],
      rebaseRequired: false,
      conflictsExpected: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.baseBranch).toBe('release');
    expect(snapshot.dependentBranches).toEqual([]);
    expect(snapshot.rebaseRequired).toBe(false);
  });

  it('derives execution state from sync results', () => {
    const result = createRebaseExecutionResult({
      plan: createRebasePlan({
        mergedPrNumber: 11,
        baseBranch: 'main',
        dependentBranches: ['feature/a'],
        rebaseRequired: true,
        conflictsExpected: false,
        updatedAt: '2026-04-04T00:00:00.000Z',
      }),
      syncMode: 'rebase',
      syncResults: [
        {
          id: 'worktree-sync-1',
          summary: 'Synced a worktree.',
          status: 'blocked',
          trace: [],
          updatedAt: '2026-04-04T00:00:00.000Z',
          taskId: 'task-1',
          branchName: 'feature/a',
          worktreePath: '/var/devplat/worktree-1',
          baseBranch: 'main',
          syncMode: 'rebase',
          changed: true,
          conflictsDetected: true,
        },
      ],
      executed: false,
      conflictsDetected: false,
    });

    expect(result.executed).toBe(true);
    expect(result.conflictsDetected).toBe(true);
  });
});
