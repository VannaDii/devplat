import { describe, expect, it } from 'vitest';

import {
  createRebaseResultArtifact,
  describeRebaseResultArtifact,
} from './logic.js';

describe('RebaseResultArtifact logic', () => {
  it('normalizes rebase result artifacts', () => {
    const artifact = createRebaseResultArtifact({
      id: 'artifact-rebase-1',
      artifactType: 'ignored',
      version: 1,
      summary: ' Rebase result ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        resultId: ' rebase-1 ',
        mergedPrNumber: 42,
        baseBranch: ' main ',
        branchName: ' feature/x ',
        rebased: true,
        conflictsDetected: false,
        details: ' Rebased cleanly ',
      },
    });

    expect(artifact.artifactType).toBe('rebase-result');
    expect(artifact.payload).toMatchObject({
      resultId: 'rebase-1',
      baseBranch: 'main',
      branchName: 'feature/x',
      details: 'Rebased cleanly',
    });
  });

  it('describes rebase result artifacts', () => {
    const description = describeRebaseResultArtifact({
      id: 'artifact-rebase-1',
      artifactType: 'rebase-result',
      version: 1,
      summary: 'Rebase result',
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

    expect(description).toContain('feature/x rebased');
  });

  it('describes failed rebases', () => {
    const description = describeRebaseResultArtifact({
      id: 'artifact-rebase-2',
      artifactType: 'rebase-result',
      version: 1,
      summary: 'Rebase result',
      status: 'blocked',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        resultId: 'rebase-2',
        mergedPrNumber: 43,
        baseBranch: 'main',
        branchName: 'feature/y',
        rebased: false,
        conflictsDetected: true,
        details: 'Conflicts detected',
      },
    });

    expect(description).toContain('feature/y not rebased');
  });
});
