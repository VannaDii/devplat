import { describe, expect, it } from 'vitest';

import { RunGatesService } from './service.js';

describe('RunGatesService', () => {
  it('runs gates through the service shell', () => {
    const service = new RunGatesService();
    const report = service.run(['lint'], 'Lint only');
    expect(service.explain(report)).toContain('1 gates');
  });

  it('covers execute with an explicit failed report', () => {
    const service = new RunGatesService();
    const report = service.execute({
      id: 'gate-run-report',
      summary: '  failed run  ',
      status: 'failed',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      passed: false,
      results: [],
    });

    expect(report.summary).toBe('failed run');
    expect(report.trace).toContain('gates:failed');
  });
});
