import { describe, expect, it } from 'vitest';

import { describeValidatedArtifact, validateArtifact } from './logic.js';

describe('ArtifactValidation logic', () => {
  it('validates known approval record artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-approval-1',
      artifactType: 'approval-record',
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.payload.approvalId).toBe('approval-1');
      expect(describeValidatedArtifact(result.value)).toBe(
        'approval-record@v1',
      );
    }
  });

  it('rejects malformed known artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-approval-1',
      artifactType: 'approval-record',
      version: 1,
      summary: 'Approve spec',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        approvalId: 'approval-1',
      },
    });

    expect(result.ok).toBe(false);
  });

  it('validates known audit log artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-audit-1',
      artifactType: 'audit-log',
      version: 1,
      summary: ' Audit event ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        auditId: ' audit-1 ',
        actorId: ' operator-1 ',
        action: 'retry-gates',
        scope: 'discord',
        details: {
          threadId: 'thread-1',
        },
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.payload.auditId).toBe('audit-1');
      expect(describeValidatedArtifact(result.value)).toBe('audit-log@v1');
    }
  });

  it('validates known merge decision artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-merge-1',
      artifactType: 'merge-decision',
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
        blockingFindings: [' finding-1 '],
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.payload.decisionId).toBe('merge-1');
      expect(describeValidatedArtifact(result.value)).toBe('merge-decision@v1');
    }
  });

  it('rejects malformed audit log artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-audit-2',
      artifactType: 'audit-log',
      version: 1,
      summary: 'Audit event',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        auditId: 'audit-2',
      },
    });

    expect(result.ok).toBe(false);
  });

  it('rejects malformed merge decision artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-merge-2',
      artifactType: 'merge-decision',
      version: 1,
      summary: 'Merge decision',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        decisionId: 'merge-2',
      },
    });

    expect(result.ok).toBe(false);
  });

  it('validates known rebase result artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-rebase-1',
      artifactType: 'rebase-result',
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.payload.resultId).toBe('rebase-1');
      expect(describeValidatedArtifact(result.value)).toBe('rebase-result@v1');
    }
  });

  it('rejects malformed rebase result artifacts', () => {
    const result = validateArtifact({
      id: 'artifact-rebase-2',
      artifactType: 'rebase-result',
      version: 1,
      summary: 'Rebase result',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        resultId: 'rebase-2',
      },
    });

    expect(result.ok).toBe(false);
  });

  it('rejects malformed artifact envelopes before dispatch', () => {
    const result = validateArtifact({
      artifactType: 'approval-record',
    });

    expect(result.ok).toBe(false);
  });

  it('falls back to the generic artifact envelope for unknown artifact types', () => {
    const result = validateArtifact({
      id: 'artifact-generic-1',
      artifactType: 'review-finding',
      version: 1,
      summary: ' Generic artifact ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        findingId: 'finding-1',
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.summary).toBe('Generic artifact');
      expect(result.value.trace).toContain('artifact:review-finding');
    }
  });
});
