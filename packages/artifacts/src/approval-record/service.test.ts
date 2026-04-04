import { describe, expect, it } from 'vitest';

import { ApprovalRecordArtifactService } from './service.js';

describe('ApprovalRecordArtifactService', () => {
  it('executes and explains approval record artifacts', () => {
    const service = new ApprovalRecordArtifactService();
    const artifact = service.execute({
      id: 'artifact-approval-1',
      artifactType: 'approval-record',
      version: 1,
      summary: ' Approve spec ',
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

    expect(artifact.summary).toBe('Approve spec');
    expect(service.explain(artifact)).toContain('approval-record');
  });
});
