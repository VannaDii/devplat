import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tscBinPath = require.resolve('typescript/bin/tsc');
const typescriptPackageJson = require('typescript/package.json');

const majorVersion = Number.parseInt(
  String(typescriptPackageJson.version).split('.')[0] ?? '',
  10,
);
const args = [...process.argv.slice(2)];

if (majorVersion >= 6 && !args.includes('--ignoreDeprecations')) {
  args.unshift('6.0');
  args.unshift('--ignoreDeprecations');
}

const child = spawn(process.execPath, [tscBinPath, ...args], {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal !== null) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
