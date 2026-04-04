import { spawnSync } from 'node:child_process';

const commands = [
  ['npm', ['run', 'build']],
  ['npm', ['run', 'typecheck']],
  ['npm', ['run', 'test:coverage']],
  ['npm', ['run', 'check:schemas']],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
