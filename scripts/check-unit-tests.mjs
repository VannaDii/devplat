import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const packagesDirectory = resolve(rootDirectory, 'packages');

const ignoredUnitFiles = new Set(['index.ts']);

const packageNames = await readdir(packagesDirectory);
const failures = [];

for (const packageName of packageNames) {
  const srcDirectory = resolve(packagesDirectory, packageName, 'src');
  const units = await readdir(srcDirectory).catch(() => []);

  for (const unit of units) {
    const unitPath = resolve(srcDirectory, unit);
    const unitStats = await stat(unitPath).catch(() => null);
    if (!unitStats?.isDirectory()) {
      continue;
    }

    const unitFiles = await readdir(unitPath);
    for (const fileName of unitFiles) {
      if (
        ignoredUnitFiles.has(fileName) ||
        !fileName.endsWith('.ts') ||
        fileName.endsWith('.test.ts')
      ) {
        continue;
      }

      if (fileName === 'logic.ts' || fileName === 'service.ts') {
        const expectedTest = fileName.replace('.ts', '.test.ts');
        if (!unitFiles.includes(expectedTest)) {
          failures.push(
            `${packageName}/${unit}/${fileName} is missing ${expectedTest}`,
          );
        }
      }
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Unit test layout violations:\n${failures.join('\n')}`);
}

console.log('All non-trivial units have required sibling tests.');
