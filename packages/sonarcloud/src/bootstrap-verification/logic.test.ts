import { describe, expect, it } from 'vitest';

import {
  createSonarBootstrapVerificationResult,
  describeSonarBootstrapVerificationResult,
  isSonarBootstrapVerificationPassing,
} from './logic.js';

describe('Sonar bootstrap verification logic', () => {
  it('passes when the quality gate is computed, green, and coverage thresholds are at least 90', () => {
    const result = createSonarBootstrapVerificationResult({
      projectKey: 'VannaDii_devplat',
      qualityGateStatus: 'OK',
      conditions: [
        {
          metricKey: 'coverage',
          comparator: 'LT',
          errorThreshold: '90',
          actualValue: '99.4',
        },
        {
          metricKey: 'new_coverage',
          comparator: 'LT',
          errorThreshold: '90',
          actualValue: '99.4',
        },
      ],
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.status).toBe('passed');
    expect(result.checks.qualityGatePassing).toBe(true);
    expect(isSonarBootstrapVerificationPassing(result)).toBe(true);
    expect(describeSonarBootstrapVerificationResult(result)).toContain(
      'VannaDii_devplat -> passed',
    );
  });

  it('fails when the configured thresholds are weaker than required', () => {
    const result = createSonarBootstrapVerificationResult({
      projectKey: 'VannaDii_devplat',
      qualityGateStatus: 'OK',
      conditions: [
        {
          metricKey: 'coverage',
          comparator: 'LT',
          errorThreshold: '80',
          actualValue: '96.0',
        },
        {
          metricKey: 'new_coverage',
          comparator: 'LT',
          errorThreshold: '85',
          actualValue: '97.0',
        },
      ],
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.status).toBe('failed');
    expect(result.issues).toContain(
      'Sonar overall coverage threshold is 80, expected at least 90.',
    );
    expect(result.issues).toContain(
      'Sonar new-code coverage threshold is 85, expected at least 90.',
    );
  });

  it('fails when the quality gate has not been computed or is not green', () => {
    const result = createSonarBootstrapVerificationResult({
      projectKey: 'VannaDii_devplat',
      qualityGateStatus: 'NONE',
      conditions: [],
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.status).toBe('failed');
    expect(result.issues).toContain(
      'Sonar quality gate has not been computed for the project.',
    );
    expect(result.issues).toContain(
      'Sonar quality gate status is NONE, expected OK.',
    );
  });
});
