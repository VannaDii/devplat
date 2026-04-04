import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FileStoreService } from '@vannadii/devplat-storage';

import { TelemetryEventService } from './service.js';

describe('TelemetryEventService', () => {
  it('records telemetry through the storage package', async () => {
    const rootDirectory = await mkdtemp(
      join(tmpdir(), 'devplat-observability-'),
    );
    const service = new TelemetryEventService(
      new FileStoreService(rootDirectory),
    );

    const event = await service.record({
      id: 'telemetry-001',
      summary: 'discord approval',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-123',
      action: 'approve-this',
      scope: 'discord',
      details: {},
    });

    expect(event.trace).toContain('telemetry:discord:approve-this');
  });

  it('covers execute and explain helpers', async () => {
    const rootDirectory = await mkdtemp(
      join(tmpdir(), 'devplat-observability-'),
    );
    const store = new FileStoreService(rootDirectory);
    const service = new TelemetryEventService(store);
    const event = await service.execute({
      id: 'telemetry-002',
      summary: 'retry gates',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-456',
      action: 'retry-gates',
      scope: 'discord',
      details: {},
    });

    expect(service.explain(event)).toContain('retry-gates');
    expect(await store.list('telemetry')).toContain('telemetry-002');
  });
});
