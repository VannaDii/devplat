import type { RebaseExecutionResult, RebasePlan } from './types.js';

export function createRebasePlan(input: RebasePlan): RebasePlan {
  const dependentBranches = [
    ...new Set(
      input.dependentBranches.map((branch) => branch.trim()).filter(Boolean),
    ),
  ];

  return {
    ...input,
    baseBranch: input.baseBranch.trim(),
    dependentBranches,
    rebaseRequired: input.rebaseRequired || dependentBranches.length > 0,
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function describeRebasePlan(input: RebasePlan): string {
  return `Rebase ${String(input.dependentBranches.length)} dependents from ${input.baseBranch}`;
}

export function createRebaseExecutionResult(
  input: RebaseExecutionResult,
): RebaseExecutionResult {
  return {
    ...input,
    executed: input.executed || input.syncResults.length > 0,
    conflictsDetected:
      input.conflictsDetected ||
      input.syncResults.some((result) => result.conflictsDetected),
  };
}
