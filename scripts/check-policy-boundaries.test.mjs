import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { collectPolicyBoundaryErrors } from './check-policy-boundaries.mjs';

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

describe('check-policy-boundaries', () => {
  const cases = [
    {
      name: 'passes on the repository source files',
      inputs: {
        rootDirectory: repoRootDirectory,
      },
      mock: async ({ rootDirectory }) => rootDirectory,
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
    {
      name: 'fails when a non-storage package accesses .devplat directly',
      inputs: {
        files: {
          'packages/storage/src/file-store/service.ts': `
            import { resolve } from 'node:path';

            export function createStorageRoot(): string {
              return resolve('.devplat', 'records');
            }
          `,
          'packages/core/src/example/service.ts': `
            import { resolve } from 'node:path';

            export function createBadPath(): string {
              return resolve('.devplat', 'records');
            }
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes('packages/core/src/example/service.ts') &&
              error.includes('.devplat'),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when decorators appear outside approved source directories',
      inputs: {
        files: {
          'packages/core/src/example/service.ts': `
            function sealed(target: unknown): void {
              void target;
            }

            @sealed
            export class ExampleService {}
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes('packages/core/src/example/service.ts') &&
              error.includes(
                'decorators outside approved OpenClaw or Discord source directories',
              ),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when a non-adapter package imports an adapter package',
      inputs: {
        files: {
          'packages/core/src/example/service.ts': `
            import { DiscordControlPlaneService } from '@vannadii/devplat-discord';

            export function createService(): DiscordControlPlaneService {
              return new DiscordControlPlaneService();
            }
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes('packages/core/src/example/service.ts') &&
              error.includes('@vannadii/devplat-discord'),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when a non-adapter package declares an adapter dependency',
      inputs: {
        files: {
          'packages/core/package.json': `
            {
              "name": "@vannadii/devplat-core",
              "version": "0.0.0",
              "dependencies": {
                "@vannadii/devplat-discord": "0.0.0"
              }
            }
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes('packages/core/package.json') &&
              error.includes('@vannadii/devplat-discord'),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'allows decorators inside adapter packages',
      inputs: {
        files: {
          'packages/openclaw/src/example/service.ts': `
            function capability(target: unknown): void {
              void target;
            }

            @capability
            export class ExampleTool {}
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
    {
      name: 'allows the OpenClaw adapter to depend on the Discord control plane',
      inputs: {
        files: {
          'packages/openclaw/package.json': `
            {
              "name": "@vannadii/devplat-openclaw",
              "version": "0.0.0",
              "dependencies": {
                "@vannadii/devplat-discord": "0.0.0"
              }
            }
          `,
          'packages/openclaw/src/example/service.ts': `
            import { DiscordControlPlaneService } from '@vannadii/devplat-discord';

            export function createService(): DiscordControlPlaneService {
              return new DiscordControlPlaneService();
            }
          `,
        },
      },
      mock: async ({ files }) => createFixtureRoot(files),
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
  ];

  it.each(cases)('$name', async (testCase) => {
    const rootDirectory = await testCase.mock(testCase.inputs);
    const outcome = await collectPolicyBoundaryErrors({ rootDirectory });
    testCase.assert(outcome);
  });
});

async function createFixtureRoot(files) {
  const rootDirectory = await mkdtemp(
    resolve(tmpdir(), 'devplat-check-policy-boundaries-'),
  );
  temporaryRoots.push(rootDirectory);

  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = resolve(rootDirectory, relativePath);
    await writeDirectory(dirname(filePath));
    await writeFile(filePath, `${content.trim()}\n`, 'utf8');
  }

  return rootDirectory;
}

async function writeDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
}
