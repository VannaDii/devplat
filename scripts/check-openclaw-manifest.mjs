import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderOpenClawManifest } from './generate-openclaw-manifest.mjs';

const rootDirectory = resolve(import.meta.dirname, '..');
const manifestPath = resolve(
  rootDirectory,
  'packages/openclaw/openclaw.plugin.json',
);

const currentManifest = await readFile(manifestPath, 'utf8');
const regeneratedManifest = await renderOpenClawManifest();

if (currentManifest !== regeneratedManifest) {
  throw new Error(
    'packages/openclaw/openclaw.plugin.json is not deterministic. Re-run npm run generate:openclaw-manifest and commit the result.',
  );
}

console.log('OpenClaw manifest is deterministic and up to date.');
