import { describe, expect, it } from 'vitest';

import {
  createCommandResult,
  describeCommandResult,
  isSuccessfulCommandResult,
} from './logic.js';

describe('CommandResult logic', () => {
  it('normalizes command results and evaluates success', () => {
    const snapshot = createCommandResult({
      command: 'node',
      args: ['-e', 'process.stdout.write("ok")'],
      exitCode: 0,
      timedOut: false,
      stdout: 'ok',
      stderr: '',
      durationMs: -1,
    });

    expect(snapshot.durationMs).toBe(0);
    expect(isSuccessfulCommandResult(snapshot)).toBe(true);
    expect(describeCommandResult(snapshot)).toContain('exit 0');
  });
});
