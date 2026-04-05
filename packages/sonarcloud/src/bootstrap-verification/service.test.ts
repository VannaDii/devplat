import { describe, expect, it } from 'vitest';

import { SonarBootstrapVerificationService } from './service.js';

describe('SonarBootstrapVerificationService', () => {
  it('evaluates bootstrap verification snapshots', () => {
    const service = new SonarBootstrapVerificationService();
    const result = service.execute({
      projectKey: 'vannadii_devplat',
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
          actualValue: '99.2',
        },
      ],
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(service.passes(result)).toBe(true);
    expect(service.explain(result)).toContain('passed');
  });

  it('reports failed bootstrap verification snapshots', () => {
    const service = new SonarBootstrapVerificationService();
    const result = service.execute({
      projectKey: 'vannadii_devplat',
      qualityGateStatus: 'ERROR',
      conditions: [
        {
          metricKey: 'coverage',
          comparator: 'LT',
          errorThreshold: '90',
          actualValue: '75.0',
        },
        {
          metricKey: 'new_coverage',
          comparator: 'LT',
          errorThreshold: '90',
          actualValue: '70.0',
        },
      ],
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(service.passes(result)).toBe(false);
    expect(result.issues).toContain(
      'Sonar quality gate status is ERROR, expected OK.',
    );
  });
});
