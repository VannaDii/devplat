import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const packagesDirectory = resolve(rootDirectory, 'packages');
const packageDirectories = (
  await readdir(packagesDirectory, {
    withFileTypes: true,
  })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .toSorted((left, right) => left.localeCompare(right));

const requiredScripts = ['build', 'clean', 'lint', 'typecheck', 'test'];

const failures = [];

for (const packageDirectoryName of packageDirectories) {
  const packageDirectory = resolve(packagesDirectory, packageDirectoryName);
  const packageJsonPath = resolve(packageDirectory, 'package.json');
  const tsconfigPath = resolve(packageDirectory, 'tsconfig.json');
  const srcIndexPath = resolve(packageDirectory, 'src/index.ts');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

  for (const filePath of [tsconfigPath, srcIndexPath]) {
    try {
      await access(filePath, constants.F_OK);
    } catch {
      failures.push(`${packageDirectoryName}: missing ${filePath}`);
    }
  }

  if (typeof packageJson.name !== 'string' || packageJson.name.length === 0) {
    failures.push(`${packageDirectoryName}: package.json must define name`);
  }

  if (
    typeof packageJson.version !== 'string' ||
    packageJson.version.length === 0
  ) {
    failures.push(`${packageDirectoryName}: package.json must define version`);
  }

  if (packageJson.type !== 'module') {
    failures.push(`${packageDirectoryName}: package.json type must be module`);
  }

  if (packageJson.main !== './dist/index.js') {
    failures.push(`${packageDirectoryName}: main must be ./dist/index.js`);
  }

  if (packageJson.types !== './dist/index.d.ts') {
    failures.push(`${packageDirectoryName}: types must be ./dist/index.d.ts`);
  }

  if (
    !Array.isArray(packageJson.files) ||
    !packageJson.files.includes('dist')
  ) {
    failures.push(`${packageDirectoryName}: files must include dist`);
  }

  if (
    packageJson.repository?.directory !== `packages/${packageDirectoryName}`
  ) {
    failures.push(
      `${packageDirectoryName}: repository.directory must be packages/${packageDirectoryName}`,
    );
  }

  for (const scriptName of requiredScripts) {
    if (typeof packageJson.scripts?.[scriptName] !== 'string') {
      failures.push(`${packageDirectoryName}: missing ${scriptName} script`);
    }
  }

  const tsconfig = JSON.parse(await readFile(tsconfigPath, 'utf8'));
  if (tsconfig.extends !== '../../tsconfig.base.json') {
    failures.push(
      `${packageDirectoryName}: tsconfig.json must extend ../../tsconfig.base.json`,
    );
  }
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log(`Validated ${packageDirectories.length} package directories.`);
