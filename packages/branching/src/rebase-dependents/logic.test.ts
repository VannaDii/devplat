import { describe, expect, it } from 'vitest';

import { createRebasePlan, describeRebasePlan } from './logic.js';

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
});
