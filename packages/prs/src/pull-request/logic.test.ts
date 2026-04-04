import { describe, expect, it } from 'vitest';

import {
  canMergePullRequest,
  createPullRequestRecord,
  describePullRequestRecord,
} from './logic.js';

describe('PullRequestRecord logic', () => {
  it('normalizes labels and computes merge readiness', () => {
    const snapshot = createPullRequestRecord({
      prNumber: 42,
      branchName: ' feature/release-flow ',
      baseBranch: ' main ',
      title: '  Release workflow hardening  ',
      labels: ['release', 'release', 'automation'],
      reviewState: 'approved',
      mergeReady: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.labels).toEqual(['release', 'automation']);
    expect(canMergePullRequest(snapshot)).toBe(true);
    expect(describePullRequestRecord(snapshot)).toContain('PR #42');
  });

  it('blocks merge when review state is not approved', () => {
    const snapshot = createPullRequestRecord({
      prNumber: 7,
      branchName: 'feature/wip',
      baseBranch: 'main',
      title: 'Work in progress',
      labels: ['wip'],
      reviewState: 'review',
      mergeReady: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(canMergePullRequest(snapshot)).toBe(false);
  });
});
