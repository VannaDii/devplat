import { appendTrace } from '@vannadii/devplat-core';

import type { PolicyDecision } from './types.js';

const sensitiveActions = new Set([
  'approve-this',
  'merge-now',
  'rebase-all-dependents',
]);

export function createPolicyDecision(input: PolicyDecision): PolicyDecision {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `policy:${input.action}`,
  );
}

export function evaluatePolicyDecision(
  action: string,
  privileged: boolean,
): PolicyDecision {
  const requiresApproval = privileged || sensitiveActions.has(action);
  const allowed = !requiresApproval;

  return createPolicyDecision({
    id: `policy-${action}`,
    summary: `Policy evaluation for ${action}`,
    status: allowed ? 'approved' : 'review',
    trace: [],
    updatedAt: new Date().toISOString(),
    action,
    allowed,
    requiresApproval,
    reason: allowed
      ? 'Action is within automatic policy limits.'
      : 'Action requires an explicit human approval path.',
  });
}

export function describePolicyDecision(input: PolicyDecision): string {
  return `${input.action} -> ${input.reason}`;
}
