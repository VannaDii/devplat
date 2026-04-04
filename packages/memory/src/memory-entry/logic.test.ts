import { describe, expect, it } from 'vitest';

import { createMemoryEntry, describeMemoryEntry } from './logic.js';

describe('MemoryEntry logic', () => {
  it('normalizes tags and optional artifact ids', () => {
    const entry = createMemoryEntry({
      memoryId: 'memory-001',
      kind: 'decision',
      subject: '  Prefer Discord-first control flow  ',
      detail: '  Approval actions must stay thread-scoped.  ',
      tags: ['discord', 'policy', 'discord', ''],
      status: 'active',
      sourceArtifactId: ' artifact-001 ',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(entry.subject).toBe('Prefer Discord-first control flow');
    expect(entry.detail).toBe('Approval actions must stay thread-scoped.');
    expect(entry.tags).toEqual(['discord', 'policy']);
    expect(entry.sourceArtifactId).toBe('artifact-001');
    expect(describeMemoryEntry(entry)).toContain('decision memory');
  });
});
