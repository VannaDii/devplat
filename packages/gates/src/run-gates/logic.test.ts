import { describe, expect, it } from 'vitest';

import {
  createGateRunReport,
  describeGateRunReport,
  runGates,
} from './logic.js';

describe('GateRunReport logic', () => {
  it('creates a passed gate report for scaffold gates', () => {
    const report = runGates(['lint', 'typecheck', 'test'], 'Run default gates');
    expect(report.passed).toBe(true);
    expect(report.results).toHaveLength(3);
    expect(describeGateRunReport(report)).toContain('passed');
  });

  it('describes failed gate reports', () => {
    const report = createGateRunReport({
      id: 'gate-run-report',
      summary: '  failed gates  ',
      status: 'failed',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      passed: false,
      results: [{ name: 'lint', success: false, detail: 'lint failed' }],
    });

    expect(report.trace).toContain('gates:failed');
    expect(describeGateRunReport(report)).toContain('failed');
  });
});
