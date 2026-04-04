export interface CommandResult {
  command: string;
  args: string[];
  exitCode: number;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface CommandExecutionOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeoutMs?: number;
}
