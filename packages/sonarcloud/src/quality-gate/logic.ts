import type { SonarQualityGateResult } from './types.js';

export function createSonarQualityGateResult(
  input: SonarQualityGateResult,
): SonarQualityGateResult {
  const overallCoverage = Math.min(100, Math.max(0, input.overallCoverage));
  const newCodeCoverage = Math.min(100, Math.max(0, input.newCodeCoverage));

  return {
    ...input,
    status:
      overallCoverage >= 90 &&
      newCodeCoverage >= 90 &&
      input.blockingIssues === 0
        ? 'passed'
        : 'failed',
    overallCoverage,
    newCodeCoverage,
    evaluatedAt: new Date(input.evaluatedAt).toISOString(),
  };
}

export function isQualityGatePassing(input: SonarQualityGateResult): boolean {
  return input.status === 'passed';
}

export function describeSonarQualityGateResult(
  input: SonarQualityGateResult,
): string {
  return `${input.projectKey} -> ${input.status}`;
}
