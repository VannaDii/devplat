import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TelemetryEventService } from '@vannadii/devplat-observability';
import { FileStoreService } from '@vannadii/devplat-storage';

import { DiscordChannelBindingService } from './service.js';

describe('DiscordChannelBindingService', () => {
  it('persists deterministic thread bindings and records telemetry', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordChannelBindingService(
      new TelemetryEventService(store),
      store,
    );

    const result = await service.bindThread(
      {
        id: 'binding-001',
        summary: 'Spec binding',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'channel-spec',
        kind: 'spec',
        threadBindingMode: 'inherit-parent',
      },
      'thread-1',
      'channel-spec',
      'operator-1',
    );

    expect(result.persistedKey).toBe('binding-001:thread-1');
    expect(result.routingKey).toBe('guild-1:spec:thread-1');
    expect(await store.list('state')).toContain('binding-001:thread-1');
    expect(await store.list('telemetry')).toContain(
      'telemetry-binding-001:thread-1',
    );
  });

  it('exposes explain helper output for bindings', () => {
    const service = new DiscordChannelBindingService();
    const explanation = service.explain({
      id: 'binding-002',
      summary: 'Audit binding',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'channel-audit',
      kind: 'audit',
      threadBindingMode: 'inherit-parent',
    });

    expect(explanation).toBe('audit:guild-1:channel-audit');
  });

  it('persists pull request thread bindings with deterministic routing keys', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-discord-'));
    const store = new FileStoreService(rootDirectory);
    const service = new DiscordChannelBindingService(
      new TelemetryEventService(store),
      store,
    );

    const result = await service.bindThread(
      {
        id: 'binding-003',
        summary: 'Pull request binding',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'channel-pr',
        kind: 'pull-request',
        threadBindingMode: 'inherit-parent',
      },
      'thread-pr-1',
      'channel-pr',
      'operator-2',
    );

    expect(result.routingKey).toBe('guild-1:pull-request:thread-pr-1');
  });
});
