import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(
  await readFile(
    resolve(rootDirectory, 'packages/openclaw/package.json'),
    'utf8',
  ),
);
const configSchema = JSON.parse(
  await readFile(
    resolve(
      rootDirectory,
      'packages/openclaw/schemas/plugin-config.schema.json',
    ),
    'utf8',
  ),
);

const manifest = {
  id: '@vannadii/devplat-openclaw',
  entry: './dist/index.js',
  configSchema,
  name: 'DevPlat OpenClaw Adapter',
  version: packageJson.version,
  description:
    'DevPlat capability bridge for OpenClaw with Discord-first operational flows.',
};

await writeFile(
  resolve(rootDirectory, 'packages/openclaw/openclaw.plugin.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log('Generated packages/openclaw/openclaw.plugin.json');
