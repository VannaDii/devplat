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
  it('passes on the repository source files', async () => {
    await expect(
      collectPolicyBoundaryErrors({ rootDirectory: repoRootDirectory }),
    ).resolves.toEqual([]);
  });

  it('fails when a non-storage package accesses .devplat directly', async () => {
    const rootDirectory = await createFixtureRoot({
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
    });

    const errors = await collectPolicyBoundaryErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('packages/core/src/example/service.ts') &&
          error.includes('.devplat'),
      ),
    ).toBe(true);
  });

  it('fails when decorators appear outside adapter packages', async () => {
    const rootDirectory = await createFixtureRoot({
      'packages/core/src/example/service.ts': `
        function sealed(target: unknown): void {
          void target;
        }

        @sealed
        export class ExampleService {}
      `,
    });

    const errors = await collectPolicyBoundaryErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('packages/core/src/example/service.ts') &&
          error.includes('decorators outside adapter packages'),
      ),
    ).toBe(true);
  });

  it('fails when a non-adapter package imports an adapter package', async () => {
    const rootDirectory = await createFixtureRoot({
      'packages/core/src/example/service.ts': `
        import { DiscordControlPlaneService } from '@vannadii/devplat-discord';

        export function createService(): DiscordControlPlaneService {
          return new DiscordControlPlaneService();
        }
      `,
    });

    const errors = await collectPolicyBoundaryErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('packages/core/src/example/service.ts') &&
          error.includes('@vannadii/devplat-discord'),
      ),
    ).toBe(true);
  });

  it('fails when a non-adapter package declares an adapter dependency', async () => {
    const rootDirectory = await createFixtureRoot({
      'packages/core/package.json': `
        {
          "name": "@vannadii/devplat-core",
          "version": "0.0.0",
          "dependencies": {
            "@vannadii/devplat-discord": "0.0.0"
          }
        }
      `,
    });

    const errors = await collectPolicyBoundaryErrors({ rootDirectory });

    expect(
      errors.some(
        (error) =>
          error.includes('packages/core/package.json') &&
          error.includes('@vannadii/devplat-discord'),
      ),
    ).toBe(true);
  });

  it('allows decorators inside adapter packages', async () => {
    const rootDirectory = await createFixtureRoot({
      'packages/openclaw/src/example/service.ts': `
        function capability(target: unknown): void {
          void target;
        }

        @capability
        export class ExampleTool {}
      `,
    });

    await expect(
      collectPolicyBoundaryErrors({ rootDirectory }),
    ).resolves.toEqual([]);
  });

  it('allows the OpenClaw adapter to depend on the Discord control plane', async () => {
    const rootDirectory = await createFixtureRoot({
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
    });

    await expect(
      collectPolicyBoundaryErrors({ rootDirectory }),
    ).resolves.toEqual([]);
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
