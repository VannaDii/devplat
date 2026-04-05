import { describe, expect, it } from 'vitest';

import {
  createSonarQualityGateResult,
  describeSonarQualityGateResult,
  isQualityGatePassing,
} from './logic.js';

describe('SonarQualityGateResult logic', () => {
  it('evaluates coverage thresholds and blocking issues', () => {
    const snapshot = createSonarQualityGateResult({
      projectKey: 'vannadii_devplat',
      status: 'failed',
      overallCoverage: 92,
      newCodeCoverage: 91,
      blockingIssues: 0,
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.status).toBe('passed');
    expect(isQualityGatePassing(snapshot)).toBe(true);
    expect(describeSonarQualityGateResult(snapshot)).toContain('passed');
  });
});
