import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';

import { GitHubWorkflowService } from './service.js';

describe('GitHubWorkflowService', () => {
  it('evaluates policy and records telemetry for GitHub actions', async () => {
    const rootDirectory = await mkdtemp(resolve(tmpdir(), 'devplat-github-'));
    const store = new FileStoreService(rootDirectory);
    const service = new GitHubWorkflowService(
      new DecisionPolicyService(),
      new TelemetryEventService(store),
    );
    const result = await service.submit({
      repoFullName: 'VannaDii/devplat',
      action: 'merge-pr',
      summary: 'Merge the release PR',
      privileged: true,
      targetNumber: 42,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.allowed).toBe(false);
    expect(await store.list('telemetry')).toHaveLength(1);
    expect(service.explain(result.request)).toContain('VannaDii/devplat');
  });

  it('prepares normal update actions and records nullable metadata', async () => {
    const rootDirectory = await mkdtemp(resolve(tmpdir(), 'devplat-github-'));
    const store = new FileStoreService(rootDirectory);
    const service = new GitHubWorkflowService(
      new DecisionPolicyService(),
      new TelemetryEventService(store),
    );

    const prepared = service.prepare({
      repoFullName: ' VannaDii/devplat ',
      action: 'update-pr',
      summary: '  Refresh the PR body  ',
      privileged: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const result = await service.submit(prepared);

    expect(prepared.repoFullName).toBe('VannaDii/devplat');
    expect(result.allowed).toBe(true);
    expect(service.explain(prepared)).toContain('update-pr');
  });
});
