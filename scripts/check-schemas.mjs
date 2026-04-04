import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

import { generateSchemas } from './generate-schemas.mjs';
import { schemaRegistry } from './schema-registry.mjs';

const rootDirectory = resolve(import.meta.dirname, '..');
const tempDirectory = await mkdtemp(join(tmpdir(), 'devplat-schemas-'));

await generateSchemas({ outDirOverride: tempDirectory });

for (const entry of schemaRegistry) {
  const actual = await readFile(
    resolve(rootDirectory, entry.outputFile),
    'utf8',
  );
  const generated = await readFile(
    resolve(tempDirectory, entry.outputFile),
    'utf8',
  );
  if (generated !== actual) {
    throw new Error(
      `Schema drift detected for ${relative(rootDirectory, resolve(rootDirectory, entry.outputFile))}. Run 'npm run generate:schemas'.`,
    );
  }
}

console.log('Schema files are up to date.');
