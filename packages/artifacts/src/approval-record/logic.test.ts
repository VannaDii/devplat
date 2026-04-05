import { describe, expect, it } from 'vitest';

import {
  createApprovalRecordArtifact,
  describeApprovalRecordArtifact,
} from './logic.js';

describe('ApprovalRecordArtifact logic', () => {
  it('normalizes approval record artifacts', () => {
    const artifact = createApprovalRecordArtifact({
      id: 'artifact-approval-1',
      artifactType: 'ignored',
      version: 1,
      summary: ' Approve spec ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        approvalId: ' approval-1 ',
        subjectType: 'spec',
        subjectId: ' spec-1 ',
        actorId: ' operator-1 ',
        decision: 'approved',
        rationale: ' Looks good ',
      },
    });

    expect(artifact.artifactType).toBe('approval-record');
    expect(artifact.summary).toBe('Approve spec');
    expect(artifact.payload).toMatchObject({
      approvalId: 'approval-1',
      subjectId: 'spec-1',
      actorId: 'operator-1',
      rationale: 'Looks good',
    });
    expect(artifact.trace).toContain('artifact:approval-record');
  });

  it('describes approval record artifacts', () => {
    const description = describeApprovalRecordArtifact({
      id: 'artifact-approval-1',
      artifactType: 'approval-record',
      version: 1,
      summary: 'Approve spec',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        approvalId: 'approval-1',
        subjectType: 'spec',
        subjectId: 'spec-1',
        actorId: 'operator-1',
        decision: 'approved',
        rationale: 'Looks good',
      },
    });

    expect(description).toContain('approved spec spec-1');
  });
});
