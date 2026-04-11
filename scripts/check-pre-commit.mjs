import { spawn } from 'node:child_process';
import { dirname } from 'node:path';

const safeChildPath = [
  dirname(process.execPath),
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/usr/bin',
  '/bin',
  '/usr/sbin',
  '/sbin',
].join(':');

const safeChildEnv = {
  ...process.env,
  PATH: safeChildPath,
};

function runCommand(label, command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/bin/env', [command, ...args], {
      env: safeChildEnv,
      stdio: 'inherit',
    });

    child.on('error', (error) => {
      reject(new Error(`${label} failed to start`, { cause: error }));
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal === null
            ? `${label} exited with code ${code ?? 1}`
            : `${label} exited due to signal ${signal}`,
        ),
      );
    });
  });
}

await runCommand('verify:node', 'npm', ['run', 'verify:node']);
await runCommand('prepare:generated', 'npm', ['run', 'prepare:generated']);
await runCommand('stage generated artifacts', 'git', [
  'add',
  '--',
  ':(glob)packages/*/schemas/*.schema.json',
  'packages/openclaw/openclaw.plugin.json',
]);
await runCommand('lint-staged', 'npx', ['--no', '--', 'lint-staged']);
await runCommand('prepare:generated after lint-staged', 'npm', [
  'run',
  'prepare:generated',
]);
await runCommand('restage generated artifacts', 'git', [
  'add',
  '--',
  ':(glob)packages/*/schemas/*.schema.json',
  'packages/openclaw/openclaw.plugin.json',
]);
await runCommand('typecheck:workspace', 'npm', ['run', 'typecheck:workspace']);
await runCommand('check:repo', 'npm', ['run', 'check:repo']);
