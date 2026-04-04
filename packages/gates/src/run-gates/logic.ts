import { appendTrace } from '@vannadii/devplat-core';

import type { GateCheckResult, GateRunReport } from './types.js';

export function buildGateResults(gateNames: string[]): GateCheckResult[] {
  return gateNames.map((name) => ({
    name,
    success: true,
    detail: `${name} passed in scaffold mode`,
  }));
}

export function createGateRunReport(input: GateRunReport): GateRunReport {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `gates:${input.passed ? 'passed' : 'failed'}`,
  );
}

export function runGates(gateNames: string[], summary: string): GateRunReport {
  const results = buildGateResults(gateNames);
  return createGateRunReport({
    id: 'gate-run-report',
    summary,
    status: 'complete',
    trace: [],
    updatedAt: new Date().toISOString(),
    passed: results.every((result) => result.success),
    results,
  });
}

export function describeGateRunReport(input: GateRunReport): string {
  return `${String(input.results.length)} gates -> ${input.passed ? 'passed' : 'failed'}`;
}
