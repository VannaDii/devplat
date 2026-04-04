import {
  createSonarQualityGateResult,
  describeSonarQualityGateResult,
  isQualityGatePassing,
} from './logic.js';
import type { SonarQualityGateResult } from './types.js';

export class SonarQualityGateService {
  public evaluate(
    projectKey: string,
    overallCoverage: number,
    newCodeCoverage: number,
    blockingIssues: number,
  ): SonarQualityGateResult {
    return createSonarQualityGateResult({
      projectKey,
      status: 'failed',
      overallCoverage,
      newCodeCoverage,
      blockingIssues,
      evaluatedAt: new Date().toISOString(),
    });
  }

  public execute(input: SonarQualityGateResult): SonarQualityGateResult {
    return createSonarQualityGateResult(input);
  }

  public passes(input: SonarQualityGateResult): boolean {
    return isQualityGatePassing(createSonarQualityGateResult(input));
  }

  public explain(input: SonarQualityGateResult): string {
    return describeSonarQualityGateResult(input);
  }
}
