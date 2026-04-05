import { spawn } from 'node:child_process';

function runCommand(label, command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
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

await runCommand('prepare:generated', 'npm', ['run', 'prepare:generated']);
await runCommand('stage generated artifacts', 'git', [
  'add',
  '--',
  ':(glob)packages/*/schemas/*.schema.json',
  'packages/openclaw/openclaw.plugin.json',
]);
await runCommand('lint-staged', 'npx', ['--no', '--', 'lint-staged']);
await runCommand('typecheck:workspace', 'npm', ['run', 'typecheck:workspace']);
await runCommand('check:schemas', 'npm', ['run', 'check:schemas']);
