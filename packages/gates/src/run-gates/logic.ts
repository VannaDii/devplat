import { appendTrace } from '@vannadii/devplat-core';
import {
  describeCommandResult,
  isSuccessfulCommandResult,
  type CommandResult,
} from '@vannadii/devplat-execution';

import type { GateCheckResult, GateRunReport } from './types.js';

export interface GateCommandSpec {
  command: string;
  args: string[];
}

export type GateExecutor = (
  command: string,
  args: readonly string[],
) => Promise<CommandResult>;

export function getNpmCommand(
  platform: NodeJS.Platform = process.platform,
): string {
  return platform === 'win32' ? 'npm.cmd' : 'npm';
}

export function resolveGateCommand(gateName: string): GateCommandSpec {
  const trimmedName = gateName.trim();
  return {
    command: getNpmCommand(),
    args: ['run', trimmedName],
  };
}

export function createGateCheckResult(
  gateName: string,
  commandResult: CommandResult,
): GateCheckResult {
  return {
    name: gateName.trim(),
    success: isSuccessfulCommandResult(commandResult),
    detail: `${describeCommandResult(commandResult)}${commandResult.timedOut ? ' (timed out)' : ''}`,
  };
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

export async function runGates(
  gateNames: string[],
  summary: string,
  executeGate: GateExecutor,
): Promise<GateRunReport> {
  const results: GateCheckResult[] = [];

  for (const gateName of gateNames) {
    const command = resolveGateCommand(gateName);
    const commandResult = await executeGate(command.command, command.args);
    results.push(createGateCheckResult(gateName, commandResult));
  }

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
