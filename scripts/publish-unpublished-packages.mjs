import { execFile } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDirectory = resolve(import.meta.dirname, '..');
const defaultRegistry = 'https://npm.pkg.github.com';

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    args.set(argv[index], argv[index + 1]);
  }

  return {
    registry: args.get('--registry') ?? defaultRegistry,
    tag: args.get('--tag') ?? '',
    dryRun: argv.includes('--dry-run'),
  };
}

async function discoverWorkspacePackages() {
  const packagesDirectory = resolve(rootDirectory, 'packages');
  const entries = await readdir(packagesDirectory, { withFileTypes: true });
  const manifests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const directory = resolve(packagesDirectory, entry.name);
        const packageJson = JSON.parse(
          await readFile(resolve(directory, 'package.json'), 'utf8'),
        );

        return {
          directory,
          packageJson,
        };
      }),
  );

  return manifests
    .filter(({ packageJson }) => packageJson.private !== true)
    .sort((left, right) =>
      left.packageJson.name.localeCompare(right.packageJson.name),
    );
}

async function isPublished({ name, version, registry }) {
  try {
    await execFileAsync(
      'npm',
      ['view', `${name}@${version}`, 'version', '--registry', registry],
      { cwd: rootDirectory, env: process.env },
    );
    return true;
  } catch (error) {
    const stdout = error.stdout ?? '';
    const stderr = error.stderr ?? '';
    const message = error.message ?? '';
    const combinedOutput = `${stdout}\n${stderr}\n${message}`;

    if (
      /E404|404 Not Found|is not in this registry|npm error code E404/iu.test(
        combinedOutput,
      )
    ) {
      return false;
    }

    throw new Error(
      `Failed to determine whether '${name}@${version}' is published.`,
      { cause: error },
    );
  }
}

async function publishPackage({ directory, registry, tag }) {
  const args = ['publish', directory, '--registry', registry];
  if (tag.length > 0) {
    args.push('--tag', tag);
  }

  await execFileAsync('npm', args, {
    cwd: rootDirectory,
    env: process.env,
  });
}

const { registry, tag, dryRun } = parseArgs(process.argv.slice(2));
const workspacePackages = await discoverWorkspacePackages();
const manifest = [];

for (const { directory, packageJson } of workspacePackages) {
  const published = await isPublished({
    name: packageJson.name,
    version: packageJson.version,
    registry,
  });

  if (published) {
    manifest.push({
      action: 'skip',
      directory,
      name: packageJson.name,
      version: packageJson.version,
    });
    continue;
  }

  if (!dryRun) {
    await publishPackage({ directory, registry, tag });
  }

  manifest.push({
    action: dryRun ? 'would-publish' : 'publish',
    directory,
    name: packageJson.name,
    version: packageJson.version,
  });
}

process.stdout.write(
  `${JSON.stringify({ registry, tag, dryRun, packages: manifest }, null, 2)}\n`,
);
