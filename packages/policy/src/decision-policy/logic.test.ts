import { describe, expect, it } from 'vitest';

import {
  createPolicyDecision,
  describePolicyDecision,
  evaluatePolicyDecision,
} from './logic.js';

describe('PolicyDecision logic', () => {
  it('flags sensitive actions for approval', () => {
    const decision = evaluatePolicyDecision('merge-now', false);
    expect(decision.allowed).toBe(false);
    expect(decision.requiresApproval).toBe(true);
    expect(decision.trace).toContain('policy:merge-now');
    expect(describePolicyDecision(decision)).toContain('merge-now');
  });

  it('preserves explicit decisions', () => {
    const decision = createPolicyDecision({
      id: 'policy-1',
      summary: '  allow retry gates  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      action: 'retry-gates',
      allowed: true,
      requiresApproval: false,
      reason: 'safe',
    });

    expect(decision.summary).toBe('allow retry gates');
  });

  it('allows safe non-privileged actions automatically', () => {
    const decision = evaluatePolicyDecision('retry-gates', false);

    expect(decision.allowed).toBe(true);
    expect(decision.requiresApproval).toBe(false);
  });
});
