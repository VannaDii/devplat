import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';
import { GitHubWorkflowService } from '@vannadii/devplat-github';

import { PullRequestService } from './service.js';

describe('PullRequestService', () => {
  it('submits PR updates through the GitHub workflow service', async () => {
    const rootDirectory = await mkdtemp(resolve(tmpdir(), 'devplat-prs-'));
    const github = new GitHubWorkflowService(
      new DecisionPolicyService(),
      new TelemetryEventService(new FileStoreService(rootDirectory)),
    );
    const service = new PullRequestService(github);
    const result = await service.submitUpdate({
      prNumber: 42,
      branchName: 'feature/release-flow',
      baseBranch: 'main',
      title: 'Release workflow hardening',
      labels: ['release'],
      reviewState: 'approved',
      mergeReady: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.request.action).toBe('update-pr');
    expect(
      await new FileStoreService(rootDirectory).list('telemetry'),
    ).toHaveLength(1);
    expect(
      service.explain(
        service.create({
          prNumber: 42,
          branchName: 'feature/release-flow',
          baseBranch: 'main',
          title: 'Release workflow hardening',
          labels: ['release'],
          reviewState: 'approved',
          mergeReady: true,
          updatedAt: '2026-04-04T00:00:00.000Z',
        }),
      ),
    ).toContain('PR #42');
  });

  it('covers create and execute helpers for non-merge-ready records', () => {
    const service = new PullRequestService();
    const created = service.create({
      prNumber: 7,
      branchName: ' feature/wip ',
      baseBranch: ' main ',
      title: '  Work in progress  ',
      labels: ['wip'],
      reviewState: 'review',
      mergeReady: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const executed = service.execute(created);

    expect(created.branchName).toBe('feature/wip');
    expect(executed.title).toBe('Work in progress');
  });
});
