import { appendTrace } from '@vannadii/devplat-core';

import type { PolicyDecision } from '@vannadii/devplat-policy';

import type { SupervisorDecision } from './types.js';

export function createSupervisorDecision(
  input: SupervisorDecision,
): SupervisorDecision {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `supervisor:${input.action}:${input.nextState}`,
  );
}

export function decideNextState(
  policyDecision: PolicyDecision,
): SupervisorDecision {
  return createSupervisorDecision({
    id: `supervisor-${policyDecision.action}`,
    summary: `Supervisor handled ${policyDecision.action}`,
    status: policyDecision.allowed ? 'approved' : 'review',
    trace: [],
    updatedAt: new Date().toISOString(),
    action: policyDecision.action,
    nextState: policyDecision.allowed ? 'approved' : 'review',
    approved: policyDecision.allowed,
    notes: [policyDecision.reason],
  });
}

export function describeSupervisorDecision(input: SupervisorDecision): string {
  return `${input.action} -> ${input.nextState}`;
}
