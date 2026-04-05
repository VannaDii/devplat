import { spawn, spawnSync } from 'node:child_process';

const safeChildPath =
  '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
const safeChildEnv = {
  ...process.env,
  PATH: safeChildPath,
};

function resolveCommand(command, args) {
  return {
    command: '/usr/bin/env',
    args: [command, ...args],
  };
}

function getStagedFiles() {
  const resolvedCommand = resolveCommand('git', [
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ]);
  const result = spawnSync(resolvedCommand.command, resolvedCommand.args, {
    encoding: 'utf8',
    env: safeChildEnv,
  });

  if (result.status !== 0) {
    throw new Error(`git diff exited with code ${result.status ?? 1}`);
  }

  return result.stdout
    .split('\n')
    .map((filePath) => filePath.trim())
    .filter(Boolean);
}

function runCommand(label, command, args) {
  return new Promise((resolve, reject) => {
    const resolvedCommand = resolveCommand(command, args);
    const child = spawn(resolvedCommand.command, resolvedCommand.args, {
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

function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/');
}

function affectsGeneratedArtifacts(filePath) {
  const normalizedPath = normalizePath(filePath);

  if (
    normalizedPath === 'scripts/schema-registry.mjs' ||
    normalizedPath === 'scripts/generate-schemas.mjs' ||
    normalizedPath === 'scripts/generate-openclaw-manifest.mjs' ||
    normalizedPath === 'packages/openclaw/package.json' ||
    normalizedPath === 'packages/openclaw/openclaw.plugin.json' ||
    normalizedPath === 'tsconfig.schemas.json' ||
    normalizedPath === 'tsconfig.base.json' ||
    normalizedPath === 'tsconfig.json'
  ) {
    return true;
  }

  if (
    normalizedPath.startsWith('packages/') &&
    normalizedPath.includes('/src/')
  ) {
    return true;
  }

  if (
    normalizedPath.startsWith('packages/') &&
    normalizedPath.includes('/schemas/') &&
    normalizedPath.endsWith('.schema.json')
  ) {
    return true;
  }

  return false;
}

function affectsWorkspaceTypecheck(filePath) {
  const normalizedPath = normalizePath(filePath);

  return (
    normalizedPath.startsWith('packages/') ||
    normalizedPath === 'package.json' ||
    normalizedPath === 'package-lock.json' ||
    normalizedPath === 'tsconfig.base.json' ||
    normalizedPath === 'tsconfig.json' ||
    normalizedPath === 'tsconfig.schemas.json'
  );
}

const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
  console.log(
    'No staged files after lint-staged; skipping generated artifact and typecheck checks.',
  );
  process.exit(0);
}

if (stagedFiles.some(affectsGeneratedArtifacts)) {
  await runCommand('prepare:generated', 'npm', ['run', 'prepare:generated']);
  await runCommand('stage generated artifacts', 'git', [
    'add',
    '--',
    ':(glob)packages/*/schemas/*.schema.json',
    'packages/openclaw/openclaw.plugin.json',
  ]);
} else {
  console.log(
    'Skipping prepare:generated; staged files cannot affect schemas or openclaw.plugin.json.',
  );
}

if (stagedFiles.some(affectsWorkspaceTypecheck)) {
  await runCommand('typecheck:workspace', 'npm', [
    'run',
    'typecheck:workspace',
  ]);
} else {
  console.log(
    'Skipping typecheck:workspace; staged files do not affect workspace type inputs.',
  );
}
