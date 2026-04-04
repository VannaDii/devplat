export type QualityGateStatus = 'passed' | 'failed';

export interface SonarQualityGateResult {
  projectKey: string;
  status: QualityGateStatus;
  overallCoverage: number;
  newCodeCoverage: number;
  blockingIssues: number;
  evaluatedAt: string;
}
