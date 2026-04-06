import { mkdtemp, cp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { collectInstructionErrors } from './check-instructions.mjs';

const repoRootDirectory = resolve(import.meta.dirname, '..');
const temporaryRoots = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((rootDirectory) =>
        rm(rootDirectory, { force: true, recursive: true }),
      ),
  );
});

describe('check-instructions', () => {
  it('passes on the repository instruction surfaces', async () => {
    await expect(
      collectInstructionErrors({ rootDirectory: repoRootDirectory }),
    ).resolves.toEqual([]);
  });

  it('fails when a version statement drifts', async () => {
    const rootDirectory = await createFixtureRoot();
    await replaceInFile(
      rootDirectory,
      'README.md',
      'Node.js `v24.14.1`',
      'Node.js `v24.0.0`',
    );

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('README.md') && error.includes('Node.js `v24.14.1`'),
      ),
    ).toBe(true);
  });

  it('fails when a required heading is missing', async () => {
    const rootDirectory = await createFixtureRoot();
    await replaceInFile(
      rootDirectory,
      'CONTRIBUTING.md',
      '## Merge Readiness',
      '## Readiness',
    );

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('CONTRIBUTING.md') &&
          error.includes('## Merge Readiness'),
      ),
    ).toBe(true);
  });

  it('fails when docs navigation omits a first-class guide', async () => {
    const rootDirectory = await createFixtureRoot();
    await replaceInFile(
      rootDirectory,
      'site/guide-docs/.vitepress/config.mts',
      "{ text: 'Lifecycle', link: '/guides/platform-lifecycle' },\n",
      '',
    );

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('site/guide-docs/.vitepress/config.mts') &&
          error.includes('/guides/platform-lifecycle'),
      ),
    ).toBe(true);
  });

  it('fails when a required workflow surface is missing', async () => {
    const rootDirectory = await createFixtureRoot();
    await rm(resolve(rootDirectory, '.github/workflows/typescript-matrix.yml'));

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('.github/workflows/typescript-matrix.yml') &&
          error.includes('Missing required workflow surface'),
      ),
    ).toBe(true);
  });

  it('fails when the platform scope drifts away from thread-aware Discord control', async () => {
    const rootDirectory = await createFixtureRoot();
    await replaceInFile(
      rootDirectory,
      'PLATFORM.md',
      'All interactions MUST be thread-aware.',
      'Interactions should be thread-aware.',
    );

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('PLATFORM.md') &&
          error.includes('All interactions MUST be thread-aware.'),
      ),
    ).toBe(true);
  });

  it('fails when OpenClaw tool documentation drifts', async () => {
    const rootDirectory = await createFixtureRoot();
    await replaceInFile(
      rootDirectory,
      'packages/openclaw/README.md',
      '- `run_supervisor_step`: run a supervisor orchestration step\n',
      '',
    );

    const errors = await collectInstructionErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('packages/openclaw/README.md') &&
          error.includes('run_supervisor_step'),
      ),
    ).toBe(true);
  });
});

async function createFixtureRoot() {
  const rootDirectory = await mkdtemp(
    resolve(tmpdir(), 'devplat-check-instructions-'),
  );
  temporaryRoots.push(rootDirectory);

  for (const relativePath of [
    '.github',
    'site/guide-docs',
    'packages/openclaw',
    'AGENTS.md',
    'CONTRIBUTING.md',
    'PLATFORM.md',
    'README.md',
    'package.json',
    '.nvmrc',
  ]) {
    await cp(
      resolve(repoRootDirectory, relativePath),
      resolve(rootDirectory, relativePath),
      {
        recursive: true,
      },
    );
  }

  return rootDirectory;
}

async function replaceInFile(
  rootDirectory,
  relativePath,
  originalText,
  nextText,
) {
  const filePath = resolve(rootDirectory, relativePath);
  const source = await readFile(filePath, 'utf8');
  const updated = source.replace(originalText, nextText);
  if (source === updated) {
    throw new Error(`Could not replace text in ${relativePath}.`);
  }

  await writeFile(filePath, updated, 'utf8');
}
