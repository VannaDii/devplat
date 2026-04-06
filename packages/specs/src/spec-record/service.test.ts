import { describe, expect, it } from 'vitest';

import { SpecRecordService } from './service.js';

describe('SpecRecordService', () => {
  it('creates spec artifacts and approvals', () => {
    const service = new SpecRecordService();
    const snapshot = service.execute({
      specId: 'spec-001',
      researchId: 'research-001',
      title: 'Discord approvals',
      objective: 'Require explicit human confirmations.',
      acceptanceCriteria: ['Thread-aware command scope'],
      approvalState: 'review',
      version: 2,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const approved = service.approve(snapshot);
    const artifact = service.toArtifact(approved);

    expect(approved.approvalState).toBe('approved');
    expect(artifact.status).toBe('approved');
    expect(artifact.payload).toMatchObject({ specId: 'spec-001' });
    expect(service.explain(snapshot)).toContain('Spec record');
  });

  it('emits draft artifacts before approval', () => {
    const service = new SpecRecordService();
    const draft = service.draft({
      specId: 'spec-002',
      researchId: 'research-002',
      title: ' Draft spec ',
      objective: ' Keep the draft path visible. ',
      acceptanceCriteria: [' one ', 'one'],
      approvalState: 'draft',
      version: 0,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const artifact = service.toArtifact(draft);

    expect(artifact.status).toBe('draft');
    expect(draft.version).toBe(1);
  });

  it('increments spec versions for updated revisions and returns them to review', () => {
    const service = new SpecRecordService();
    const updated = service.update({
      specId: 'spec-003',
      researchId: 'research-003',
      title: 'Approved spec',
      objective: 'Preserve revision history.',
      acceptanceCriteria: ['record updates'],
      approvalState: 'approved',
      version: 3,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(updated.version).toBe(4);
    expect(updated.approvalState).toBe('review');
  });

  it('preserves non-approved review state when creating an updated revision', () => {
    const service = new SpecRecordService();
    const updated = service.update({
      specId: 'spec-004',
      researchId: 'research-004',
      title: 'Review spec',
      objective: 'Keep in-review revisions in review.',
      acceptanceCriteria: ['retain review state'],
      approvalState: 'review',
      version: 1,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(updated.version).toBe(2);
    expect(updated.approvalState).toBe('review');
  });
});
