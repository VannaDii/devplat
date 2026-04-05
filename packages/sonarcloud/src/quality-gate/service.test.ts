import { describe, expect, it } from 'vitest';

import { SonarQualityGateService } from './service.js';

describe('SonarQualityGateService', () => {
  it('enforces the 90 percent coverage policy', () => {
    const service = new SonarQualityGateService();
    const passing = service.evaluate('vannadii_devplat', 95, 90, 0);
    const failing = service.evaluate('vannadii_devplat', 89, 92, 0);

    expect(service.passes(passing)).toBe(true);
    expect(service.passes(failing)).toBe(false);
    expect(service.explain(passing)).toContain('passed');
  });

  it('covers direct execute for blocking-issue failures', () => {
    const service = new SonarQualityGateService();
    const result = service.execute({
      projectKey: 'vannadii_devplat',
      status: 'passed',
      overallCoverage: 100,
      newCodeCoverage: 100,
      blockingIssues: 1,
      evaluatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.status).toBe('failed');
  });
});
