import { describe, expect, it } from 'vitest';

import { MergeDecisionArtifactService } from './service.js';

describe('MergeDecisionArtifactService', () => {
  it('executes and explains merge decision artifacts', () => {
    const service = new MergeDecisionArtifactService();
    const artifact = service.execute({
      id: 'artifact-merge-1',
      artifactType: 'merge-decision',
      version: 1,
      summary: ' Merge decision ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        decisionId: 'merge-1',
        prNumber: 42,
        actorId: 'operator-1',
        mergeStrategy: 'merge',
        approved: true,
        rationale: 'Ready',
        blockingFindings: [],
      },
    });

    expect(artifact.summary).toBe('Merge decision');
    expect(service.explain(artifact)).toContain('merge-decision');
  });
});
