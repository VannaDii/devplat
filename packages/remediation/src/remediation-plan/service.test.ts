import { describe, expect, it } from 'vitest';

import { RemediationPlanService } from './service.js';

describe('RemediationPlanService', () => {
  it('derives remediation plans from review findings', () => {
    const service = new RemediationPlanService();
    const snapshot = service.fromFindings(
      [
        {
          findingId: 'finding-001',
          severity: 'critical',
          path: 'packages/openclaw/src/index.ts',
          message: 'Validation gap',
          rationale: 'Invalid inputs could bypass policy.',
          fixRecommendation: 'Decode and reject invalid payloads.',
          blocking: true,
          updatedAt: '2026-04-04T00:00:00.000Z',
        },
      ],
      true,
    );

    expect(snapshot.approvalRequired).toBe(true);
    expect(snapshot.findingIds).toEqual(['finding-001']);
    expect(service.explain(snapshot)).toContain('remediation-');
  });

  it('covers create and execute helpers for manual remediation', () => {
    const service = new RemediationPlanService();
    const created = service.create({
      planId: 'manual-plan',
      findingIds: ['finding-002', 'finding-002'],
      actions: ['  update tests  ', 'update tests'],
      autofix: false,
      approvalRequired: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const executed = service.execute(created);

    expect(created.approvalRequired).toBe(true);
    expect(executed.actions).toEqual(['update tests']);
  });
});
