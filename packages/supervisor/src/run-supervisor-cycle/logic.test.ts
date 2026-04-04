import { describe, expect, it } from 'vitest';

import {
  createSupervisorDecision,
  decideNextState,
  describeSupervisorDecision,
} from './logic.js';

describe('SupervisorDecision logic', () => {
  it('routes blocked actions into review state', () => {
    const decision = decideNextState({
      id: 'policy-merge-now',
      summary: 'policy',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      action: 'merge-now',
      allowed: false,
      requiresApproval: true,
      reason: 'requires approval',
    });

    expect(decision.nextState).toBe('review');
    expect(decision.trace).toContain('supervisor:merge-now:review');
  });

  it('routes allowed actions into approved state', () => {
    const decision = decideNextState({
      id: 'policy-retry-gates',
      summary: 'policy',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      action: 'retry-gates',
      allowed: true,
      requiresApproval: false,
      reason: 'safe',
    });
    const executed = createSupervisorDecision(decision);

    expect(decision.approved).toBe(true);
    expect(describeSupervisorDecision(executed)).toContain(
      'retry-gates -> approved',
    );
  });
});
