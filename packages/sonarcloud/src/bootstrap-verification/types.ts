export type SonarApiQualityGateStatus = 'ERROR' | 'NONE' | 'OK';

export interface SonarQualityGateConditionSnapshot {
  metricKey: string;
  comparator: string;
  errorThreshold: string;
  actualValue: string | null;
}

export interface SonarBootstrapVerificationInput {
  projectKey: string;
  qualityGateStatus: SonarApiQualityGateStatus;
  conditions: SonarQualityGateConditionSnapshot[];
  evaluatedAt: string;
}

export interface SonarBootstrapVerificationChecks {
  qualityGateComputed: boolean;
  qualityGatePassing: boolean;
  overallCoverageCondition: boolean;
  newCodeCoverageCondition: boolean;
}

export interface SonarBootstrapVerificationResult {
  projectKey: string;
  status: 'failed' | 'passed';
  qualityGateStatus: SonarApiQualityGateStatus;
  overallCoverageThreshold: number;
  newCodeCoverageThreshold: number;
  checks: SonarBootstrapVerificationChecks;
  issues: string[];
  evaluatedAt: string;
}
