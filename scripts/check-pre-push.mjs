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

async function runConcurrent(commands) {
  const running = commands.map(({ label, command, args }) => ({
    label,
    child: spawn(command, args, {
      env: process.env,
      stdio: 'inherit',
    }),
  }));

  const promises = running.map(
    ({ label, child }) =>
      new Promise((resolve, reject) => {
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
      }),
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    for (const { child } of running) {
      if (
        child.exitCode === null &&
        child.signalCode === null &&
        !child.killed
      ) {
        child.kill('SIGTERM');
      }
    }

    await Promise.allSettled(promises);
    throw error;
  }
}

await runCommand('verify:node', 'npm', ['run', 'verify:node']);
await runCommand('prepare:generated', 'npm', ['run', 'prepare:generated']);
await runCommand('check:unit-tests', 'npm', ['run', 'check:unit-tests']);
await runConcurrent([
  {
    label: 'build:workspace',
    command: 'npm',
    args: ['run', 'build:workspace'],
  },
  {
    label: 'test:coverage:workspace',
    command: 'npm',
    args: ['run', 'test:coverage:workspace'],
  },
]);
