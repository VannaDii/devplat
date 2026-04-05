import { describe, expect, it } from 'vitest';

import {
  createMergeDecisionArtifact,
  describeMergeDecisionArtifact,
} from './logic.js';

describe('MergeDecisionArtifact logic', () => {
  it('normalizes merge decision artifacts', () => {
    const artifact = createMergeDecisionArtifact({
      id: 'artifact-merge-1',
      artifactType: 'ignored',
      version: 1,
      summary: ' Merge decision ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        decisionId: ' merge-1 ',
        prNumber: 42,
        actorId: ' operator-1 ',
        mergeStrategy: 'squash',
        approved: true,
        rationale: ' Ready to merge ',
        blockingFindings: [' none '],
      },
    });

    expect(artifact.artifactType).toBe('merge-decision');
    expect(artifact.payload).toMatchObject({
      decisionId: 'merge-1',
      actorId: 'operator-1',
      rationale: 'Ready to merge',
      blockingFindings: ['none'],
    });
  });

  it('describes merge decision artifacts', () => {
    const description = describeMergeDecisionArtifact({
      id: 'artifact-merge-1',
      artifactType: 'merge-decision',
      version: 1,
      summary: 'Merge decision',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        decisionId: 'merge-1',
        prNumber: 42,
        actorId: 'operator-1',
        mergeStrategy: 'squash',
        approved: true,
        rationale: 'Ready to merge',
        blockingFindings: [],
      },
    });

    expect(description).toContain('pr #42 approved');
  });

  it('describes blocked merge decisions', () => {
    const description = describeMergeDecisionArtifact({
      id: 'artifact-merge-2',
      artifactType: 'merge-decision',
      version: 1,
      summary: 'Merge decision',
      status: 'blocked',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        decisionId: 'merge-2',
        prNumber: 77,
        actorId: 'operator-1',
        mergeStrategy: 'merge',
        approved: false,
        rationale: 'Blocked on review findings',
        blockingFindings: ['finding-1'],
      },
    });

    expect(description).toContain('pr #77 blocked');
  });
});
