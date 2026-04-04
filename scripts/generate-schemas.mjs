import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { createGenerator } from 'ts-json-schema-generator';

import { schemaRegistry } from './schema-registry.mjs';

const rootDirectory = resolve(import.meta.dirname, '..');

export async function generateSchemas(options = { outDirOverride: null }) {
  for (const entry of schemaRegistry) {
    const outputPath =
      options.outDirOverride === null
        ? resolve(rootDirectory, entry.outputFile)
        : resolve(options.outDirOverride, entry.outputFile);

    const generator = createGenerator({
      path: resolve(rootDirectory, 'packages/*/src/**/*.ts'),
      tsconfig: resolve(rootDirectory, 'tsconfig.schemas.json'),
      type: entry.typeName,
      expose: 'export',
      additionalProperties: false,
      skipTypeCheck: true,
    });

    const schema = generator.createSchema(entry.typeName);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateSchemas();
}
