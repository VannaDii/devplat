import type { RemediationPlan } from './types.js';

export function createRemediationPlan(input: RemediationPlan): RemediationPlan {
  return {
    ...input,
    findingIds: [
      ...new Set(input.findingIds.map((value) => value.trim()).filter(Boolean)),
    ],
    actions: [
      ...new Set(input.actions.map((value) => value.trim()).filter(Boolean)),
    ],
    approvalRequired: input.approvalRequired || !input.autofix,
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function describeRemediationPlan(input: RemediationPlan): string {
  return `Remediation plan -> ${input.planId}`;
}
