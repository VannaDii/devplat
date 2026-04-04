import { describe, expect, it } from 'vitest';

import { DecisionPolicyService } from './service.js';

describe('DecisionPolicyService', () => {
  it('evaluates control actions for privileged paths', () => {
    const service = new DecisionPolicyService();
    const decision = service.evaluateControlAction('approve-this', true);

    expect(decision.allowed).toBe(false);
    expect(service.explain(decision)).toContain('approve-this');
  });

  it('covers direct execute for explicit policy decisions', () => {
    const service = new DecisionPolicyService();
    const decision = service.execute({
      id: 'policy-retry-gates',
      summary: '  retry gates  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      action: 'retry-gates',
      allowed: true,
      requiresApproval: false,
      reason: 'safe',
    });

    expect(decision.summary).toBe('retry gates');
  });
});
