import { describe, expect, it } from 'vitest';

import { RebaseDependentsService } from './service.js';

describe('RebaseDependentsService', () => {
  it('creates downstream rebase plans from merged pull requests', () => {
    const service = new RebaseDependentsService();
    const snapshot = service.createForMerge(
      {
        prNumber: 42,
        branchName: 'feature/release-flow',
        baseBranch: 'main',
        title: 'Release workflow hardening',
        labels: ['release'],
        reviewState: 'approved',
        mergeReady: true,
        updatedAt: '2026-04-04T00:00:00.000Z',
      },
      ['feature/a', 'feature/b'],
    );

    expect(snapshot.mergedPrNumber).toBe(42);
    expect(snapshot.rebaseRequired).toBe(true);
    expect(service.explain(snapshot)).toContain('2 dependents');
  });

  it('covers direct create and execute helpers', () => {
    const service = new RebaseDependentsService();
    const created = service.create({
      mergedPrNumber: 8,
      baseBranch: ' main ',
      dependentBranches: [],
      rebaseRequired: false,
      conflictsExpected: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const executed = service.execute(created);

    expect(created.baseBranch).toBe('main');
    expect(executed.rebaseRequired).toBe(false);
    expect(service.explain(executed)).toContain('0 dependents');
  });

  it('executes dependent rebases through worktree sync orchestration', () => {
    const service = new RebaseDependentsService();
    const snapshot = service.executeForMerge({
      record: {
        prNumber: 42,
        branchName: 'feature/release-flow',
        baseBranch: 'main',
        title: 'Release workflow hardening',
        labels: ['release'],
        reviewState: 'approved',
        mergeReady: true,
        updatedAt: '2026-04-04T00:00:00.000Z',
      },
      dependentBranches: ['feature/a'],
    });

    expect(snapshot).toMatchObject({
      plan: {
        mergedPrNumber: 42,
        dependentBranches: ['feature/a'],
      },
      syncMode: 'rebase',
      executed: true,
      syncResults: [
        {
          branchName: 'feature/a',
          baseBranch: 'main',
        },
      ],
    });
  });
});
