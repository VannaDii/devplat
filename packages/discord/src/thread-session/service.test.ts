import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ArtifactEnvelopeService } from '@vannadii/devplat-artifacts';
import { TelemetryEventService } from '@vannadii/devplat-observability';
import { FileStoreService } from '@vannadii/devplat-storage';

import { DiscordThreadSessionService } from './service.js';

describe('DiscordThreadSessionService', () => {
  it('opens spec threads with persisted state and artifacts', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordThreadSessionService(
      new ArtifactEnvelopeService(),
      new TelemetryEventService(store),
      store,
    );

    const result = await service.openThread({
      id: 'thread-session-001',
      summary: 'Spec thread',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-1',
      parentChannelId: 'channel-spec',
      threadId: 'thread-1',
      kind: 'spec',
      specId: 'spec-1',
      sliceId: null,
      pullRequestNumber: null,
      artifactId: 'artifact-thread-1',
    });

    expect(result.persistedKey).toBe('thread-session-001');
    expect(result.artifactId).toBe('artifact-thread-1');
    expect(await store.list('state')).toContain('thread-session-001');
    expect(await store.list('artifacts')).toContain('artifact-thread-1');
  });

  it('exposes helper methods for implementation thread sessions', () => {
    const service = new DiscordThreadSessionService();
    const session = service.execute({
      id: 'thread-session-002',
      summary: '  Implementation thread  ',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-2',
      parentChannelId: 'channel-impl',
      threadId: 'thread-2',
      kind: 'implementation',
      specId: 'spec-1',
      sliceId: 'slice-1',
      pullRequestNumber: null,
      artifactId: 'artifact-thread-2',
    });

    expect(session.trace).toContain('discord:thread:implementation:thread-2');
    expect(service.explain(session)).toContain('implementation:thread-2');
  });

  it('opens implementation threads with implementation-specific artifacts', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordThreadSessionService(
      new ArtifactEnvelopeService(),
      new TelemetryEventService(store),
      store,
    );

    const result = await service.openThread({
      id: 'thread-session-003',
      summary: 'Implementation thread',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-3',
      parentChannelId: 'channel-impl',
      threadId: 'thread-3',
      kind: 'implementation',
      specId: 'spec-2',
      sliceId: 'slice-2',
      pullRequestNumber: null,
      artifactId: 'artifact-thread-3',
    });

    expect(result.artifactId).toBe('artifact-thread-3');
    expect(await store.list('artifacts')).toContain('artifact-thread-3');
    expect(await store.list('telemetry')).toContain(
      'telemetry-thread-session-003',
    );
  });

  it('opens pull request threads with pull-request-specific artifacts', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordThreadSessionService(
      new ArtifactEnvelopeService(),
      new TelemetryEventService(store),
      store,
    );

    const result = await service.openThread({
      id: 'thread-session-004',
      summary: 'Pull request thread',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-4',
      parentChannelId: 'channel-pr',
      threadId: 'thread-4',
      kind: 'pull-request',
      specId: null,
      sliceId: null,
      pullRequestNumber: 12,
      artifactId: 'artifact-thread-4',
    });

    expect(result.artifactId).toBe('artifact-thread-4');
    expect(await store.list('artifacts')).toContain('artifact-thread-4');

    const artifactRecord = await store.read('artifacts', 'artifact-thread-4');

    expect(artifactRecord.ok).toBe(true);
    if (!artifactRecord.ok) {
      return;
    }

    expect(artifactRecord.value.payload).toMatchObject({
      artifactType: 'discord-pull-request-thread',
    });
  });
});
