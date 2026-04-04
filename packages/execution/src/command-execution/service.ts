import { spawn } from 'node:child_process';

import { createCommandResult, describeCommandResult } from './logic.js';
import type { CommandExecutionOptions, CommandResult } from './types.js';

export class CommandExecutionService {
  public async execute(
    command: string,
    args: readonly string[] = [],
    options: CommandExecutionOptions = {},
  ): Promise<CommandResult> {
    const startedAt = Date.now();

    return new Promise((resolvePromise) => {
      const child = spawn(command, [...args], {
        cwd: options.cwd,
        env: options.env ? { ...process.env, ...options.env } : process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let settled = false;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const settle = (exitCode: number): void => {
        if (settled) {
          return;
        }

        settled = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        resolvePromise(
          createCommandResult({
            command,
            args: [...args],
            exitCode,
            timedOut,
            stdout,
            stderr,
            durationMs: Date.now() - startedAt,
          }),
        );
      };

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });
      child.on('error', (error: Error) => {
        stderr = error.message;
        settle(1);
      });
      child.on('close', (code: number | null) => {
        settle(code ?? (timedOut ? 124 : 1));
      });

      if (typeof options.timeoutMs === 'number' && options.timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
        }, options.timeoutMs);
      }
    });
  }

  public explain(input: CommandResult): string {
    return describeCommandResult(input);
  }
}
