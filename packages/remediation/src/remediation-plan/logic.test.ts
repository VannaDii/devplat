import { describe, expect, it } from 'vitest';

import { createRemediationPlan, describeRemediationPlan } from './logic.js';

describe('RemediationPlan logic', () => {
  it('normalizes remediation actions and approval requirements', () => {
    const snapshot = createRemediationPlan({
      planId: 'plan-001',
      findingIds: ['finding-001', 'finding-001'],
      actions: ['Fix decoder', 'Fix decoder'],
      autofix: true,
      approvalRequired: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.findingIds).toEqual(['finding-001']);
    expect(snapshot.actions).toEqual(['Fix decoder']);
    expect(describeRemediationPlan(snapshot)).toContain('plan-001');
  });
});
