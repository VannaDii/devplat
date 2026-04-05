import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const manifestPath = resolve(
  rootDirectory,
  'packages/openclaw/openclaw.plugin.json',
);

const currentManifest = await readFile(manifestPath, 'utf8');
let regeneratedManifest;

try {
  await import('./generate-openclaw-manifest.mjs');
  regeneratedManifest = await readFile(manifestPath, 'utf8');
} finally {
  await writeFile(manifestPath, currentManifest, 'utf8');
}

if (currentManifest !== regeneratedManifest) {
  throw new Error(
    'packages/openclaw/openclaw.plugin.json is not deterministic. Re-run npm run generate:openclaw-manifest and commit the result.',
  );
}

console.log('OpenClaw manifest is deterministic and up to date.');
