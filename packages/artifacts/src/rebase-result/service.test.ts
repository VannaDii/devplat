import { describe, expect, it } from 'vitest';

import { RebaseResultArtifactService } from './service.js';

describe('RebaseResultArtifactService', () => {
  it('executes and explains rebase result artifacts', () => {
    const service = new RebaseResultArtifactService();
    const artifact = service.execute({
      id: 'artifact-rebase-1',
      artifactType: 'rebase-result',
      version: 1,
      summary: ' Rebase result ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        resultId: 'rebase-1',
        mergedPrNumber: 42,
        baseBranch: 'main',
        branchName: 'feature/x',
        rebased: true,
        conflictsDetected: false,
        details: 'Rebased cleanly',
      },
    });

    expect(artifact.summary).toBe('Rebase result');
    expect(service.explain(artifact)).toContain('rebase-result');
  });
});
