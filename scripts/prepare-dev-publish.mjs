import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
];

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    args.set(argv[index], argv[index + 1]);
  }
  return {
    outDir: args.get('--out-dir'),
    suffix: args.get('--suffix'),
    packages: (args.get('--packages') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  };
}

async function discoverWorkspacePackages() {
  const packagesDirectory = resolve(rootDirectory, 'packages');
  const entries = await readdir(packagesDirectory, { withFileTypes: true });
  const manifests = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const sourceDirectory = resolve(packagesDirectory, entry.name);
        const packageJsonPath = resolve(sourceDirectory, 'package.json');
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

        return {
          dirName: entry.name,
          packageJson,
          sourceDirectory,
        };
      }),
  );

  return manifests.sort((left, right) =>
    left.packageJson.name.localeCompare(right.packageJson.name),
  );
}

function shouldCopyPath(sourcePath) {
  return !sourcePath.split('/').includes('node_modules');
}

const { outDir, suffix, packages } = parseArgs(process.argv.slice(2));
if (!outDir || !suffix) {
  throw new Error(
    'Usage: node scripts/prepare-dev-publish.mjs --out-dir <dir> --suffix <suffix> --packages <pkg-a,pkg-b>',
  );
}

const workspacePackages = await discoverWorkspacePackages();
const packagesByName = new Map(
  workspacePackages.map((workspacePackage) => [
    workspacePackage.packageJson.name,
    workspacePackage,
  ]),
);
const selectedPackages =
  packages.length > 0
    ? packages.map((packageName) => {
        const workspacePackage = packagesByName.get(packageName);
        if (workspacePackage === undefined) {
          throw new Error(`Unknown workspace package '${packageName}'.`);
        }

        return workspacePackage;
      })
    : workspacePackages;
const selectedPackageNames = new Set(
  selectedPackages.map((workspacePackage) => workspacePackage.packageJson.name),
);

const manifest = {
  outDir: resolve(rootDirectory, outDir),
  versionSuffix: suffix,
  packages: [],
};

await rm(manifest.outDir, { recursive: true, force: true });
await mkdir(manifest.outDir, { recursive: true });

for (const {
  packageJson: sourcePackageJson,
  sourceDirectory,
} of selectedPackages) {
  const packageJson = structuredClone(sourcePackageJson);
  const targetDirectory = resolve(manifest.outDir, basename(sourceDirectory));

  await cp(sourceDirectory, targetDirectory, {
    recursive: true,
    filter: shouldCopyPath,
  });
  packageJson.version = `${packageJson.version}-${suffix}`;

  for (const dependencyField of dependencyFields) {
    const deps = packageJson[dependencyField];
    if (!deps) {
      continue;
    }

    for (const dependencyName of Object.keys(deps)) {
      if (selectedPackageNames.has(dependencyName)) {
        deps[dependencyName] = packageJson.version;
      }
    }
  }

  await writeFile(
    resolve(targetDirectory, 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8',
  );

  manifest.packages.push({
    dir: targetDirectory,
    name: packageJson.name,
    version: packageJson.version,
  });
}

process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
