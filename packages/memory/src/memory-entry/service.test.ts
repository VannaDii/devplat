import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FileStoreService } from '@vannadii/devplat-storage';

import { MemoryEntryService } from './service.js';

describe('MemoryEntryService', () => {
  it('persists normalized memory entries through storage', async () => {
    const rootDirectory = await mkdtemp(resolve(tmpdir(), 'devplat-memory-'));
    const service = new MemoryEntryService(new FileStoreService(rootDirectory));
    const entry = await service.execute({
      memoryId: 'memory-001',
      kind: 'constraint',
      subject: 'Only storage may access .devplat',
      detail: 'Filesystem access must stay isolated.',
      tags: ['storage', 'governance'],
      status: 'active',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(entry.memoryId).toBe('memory-001');
    expect(await new FileStoreService(rootDirectory).list('memory')).toContain(
      'memory-001',
    );
    expect(service.explain(entry)).toContain('constraint memory');
  });
});
