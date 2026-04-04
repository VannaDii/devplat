import { describe, expect, it } from 'vitest';

import { CommandExecutionService } from './service.js';

describe('CommandExecutionService', () => {
  it('executes subprocesses and captures structured output', async () => {
    const service = new CommandExecutionService();
    const snapshot = await service.execute(
      process.execPath,
      ['-e', 'process.stdout.write(process.env.DEVPLAT_TEST_VALUE ?? "")'],
      {
        env: {
          DEVPLAT_TEST_VALUE: 'ok',
        },
      },
    );

    expect(snapshot.exitCode).toBe(0);
    expect(snapshot.stdout).toBe('ok');
    expect(service.explain(snapshot)).toContain('exit 0');
  });

  it('returns structured failures when spawning fails', async () => {
    const service = new CommandExecutionService();
    const snapshot = await service.execute(
      'definitely-not-a-real-command-devplat',
    );

    expect(snapshot.exitCode).toBe(1);
    expect(snapshot.stderr.length).toBeGreaterThan(0);
  });

  it('captures stderr output from failing subprocesses', async () => {
    const service = new CommandExecutionService();
    const snapshot = await service.execute(process.execPath, [
      '-e',
      'process.stderr.write("bad"); process.exit(2)',
    ]);

    expect(snapshot.exitCode).toBe(2);
    expect(snapshot.stderr).toBe('bad');
  });

  it('terminates subprocesses when timeouts are exceeded', async () => {
    const service = new CommandExecutionService();
    const snapshot = await service.execute(
      process.execPath,
      ['-e', 'setTimeout(() => {}, 1_000)'],
      { timeoutMs: 25 },
    );

    expect(snapshot.timedOut).toBe(true);
    expect(snapshot.exitCode).toBe(124);
  });
});
