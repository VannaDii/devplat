import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CommandExecutionService,
  type CommandResult,
} from '@vannadii/devplat-execution';

import { getNpmCommand } from './logic.js';
import { RunGatesService } from './service.js';

describe('RunGatesService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs gates through the service shell', async () => {
    const service = new RunGatesService(
      async (
        command: string,
        args: readonly string[],
      ): Promise<CommandResult> => ({
        command,
        args: [...args],
        exitCode: 0,
        timedOut: false,
        stdout: '',
        stderr: '',
        durationMs: 5,
      }),
    );
    const report = await service.run(['lint'], 'Lint only');
    expect(service.explain(report)).toContain('1 gates');
  });

  it('uses the default command execution service when no executor is supplied', async () => {
    const executeSpy = vi
      .spyOn(CommandExecutionService.prototype, 'execute')
      .mockResolvedValue({
        command: getNpmCommand(),
        args: ['run', 'lint'],
        exitCode: 0,
        timedOut: false,
        stdout: '',
        stderr: '',
        durationMs: 5,
      });

    const service = new RunGatesService();
    const report = await service.run(['lint'], 'Lint only');

    expect(executeSpy).toHaveBeenCalledWith(getNpmCommand(), ['run', 'lint']);
    expect(report.passed).toBe(true);
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
