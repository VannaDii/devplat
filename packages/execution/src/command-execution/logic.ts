import type { CommandResult } from './types.js';

export function createCommandResult(input: CommandResult): CommandResult {
  return {
    ...input,
    command: input.command.trim(),
    args: [...input.args],
    stdout: input.stdout,
    stderr: input.stderr,
    durationMs: Math.max(0, input.durationMs),
  };
}

export function isSuccessfulCommandResult(input: CommandResult): boolean {
  return input.exitCode === 0 && !input.timedOut;
}

export function describeCommandResult(input: CommandResult): string {
  return `${input.command} -> exit ${String(input.exitCode)}`;
}
