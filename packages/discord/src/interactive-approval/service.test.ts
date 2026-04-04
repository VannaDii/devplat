import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ArtifactEnvelopeService } from '@vannadii/devplat-artifacts';
import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';

import { DiscordInteractiveApprovalService } from './service.js';

describe('DiscordInteractiveApprovalService', () => {
  it('records explicit approval artifacts and blocks privileged merges', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordInteractiveApprovalService(
      new DecisionPolicyService(),
      new ArtifactEnvelopeService(),
      new TelemetryEventService(store),
      store,
    );

    const result = await service.handleApproval({
      id: 'approval-001',
      summary: 'Merge slice after approval',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'operator-1',
      channelId: 'channel-1',
      threadId: 'thread-1',
      action: 'merge',
      artifactId: 'artifact-1',
      privileged: true,
    });

    expect(result.allowed).toBe(false);
    expect(result.artifactId).toBe('approval-001:artifact');
    expect(await store.list('artifacts')).toContain('approval-001:artifact');
  });

  it('allows retry approvals and exposes explain helper output', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordInteractiveApprovalService(
      new DecisionPolicyService(),
      new ArtifactEnvelopeService(),
      new TelemetryEventService(store),
      store,
    );

    const request = service.execute({
      id: 'approval-002',
      summary: '  Retry gates  ',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'operator-2',
      channelId: 'channel-2',
      threadId: 'thread-2',
      action: 'retry',
      artifactId: 'artifact-2',
      privileged: false,
    });
    const result = await service.handleApproval(request);

    expect(service.explain(request)).toContain('thread-2:retry');
    expect(result.allowed).toBe(true);
    expect(await store.list('state')).toContain('approval-002');
  });
});
