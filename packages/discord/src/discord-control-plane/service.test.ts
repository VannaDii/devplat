import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';

import { DiscordControlPlaneService } from './service.js';

describe('DiscordControlPlaneService', () => {
  it('records thread-aware control actions with policy enforcement', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordControlPlaneService(
      new DecisionPolicyService(),
      new TelemetryEventService(store),
      store,
    );

    const result = await service.handleAction({
      id: 'discord-001',
      summary: 'retry gates',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-1',
      threadId: 'thread-1',
      channelId: 'channel-1',
      action: 'retry-gates',
      privileged: false,
    });

    expect(result.allowed).toBe(true);
    expect(result.persistedKey).toBe('discord-001');
  });

  it('blocks privileged merge actions and exposes helper methods', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordControlPlaneService(
      new DecisionPolicyService(),
      new TelemetryEventService(store),
      store,
    );

    const prepared = service.execute({
      id: 'discord-002',
      summary: '  merge now  ',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-2',
      threadId: 'thread-2',
      channelId: 'channel-2',
      action: 'merge-now',
      privileged: true,
    });
    const result = await service.handleAction(prepared);

    expect(service.explain(prepared)).toContain('thread-2:merge-now');
    expect(result.allowed).toBe(false);
    expect(await store.list('state')).toContain('discord-002');
  });
});
