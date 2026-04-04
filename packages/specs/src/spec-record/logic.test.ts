import { describe, expect, it } from 'vitest';

import {
  approveSpecRecord,
  createSpecRecord,
  describeSpecRecord,
} from './logic.js';

describe('SpecRecord logic', () => {
  it('normalizes acceptance criteria and approval state transitions', () => {
    const snapshot = createSpecRecord({
      specId: 'spec-001',
      researchId: 'research-001',
      title: '  Discord-first approvals  ',
      objective: '  Define how explicit approvals are recorded.  ',
      acceptanceCriteria: [
        'Audit log entry',
        'Audit log entry',
        'Thread scoped',
      ],
      approvalState: 'draft',
      version: 1,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const approved = approveSpecRecord(snapshot);

    expect(snapshot.title).toBe('Discord-first approvals');
    expect(snapshot.acceptanceCriteria).toEqual([
      'Audit log entry',
      'Thread scoped',
    ]);
    expect(approved.approvalState).toBe('approved');
    expect(describeSpecRecord(snapshot)).toContain('Spec record');
  });
});
