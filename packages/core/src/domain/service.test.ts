import { describe, expect, it } from 'vitest';

import { DomainSnapshotCodec } from './codec.js';
import { DomainService, decodeWithCodec } from './service.js';

describe('DomainService', () => {
  it('delegates to the unit logic', () => {
    const service = new DomainService();
    const snapshot = service.execute({
      id: 'core-001',
      summary: 'Shared domain primitives for DevPlat.',
      status: 'draft',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      domain: 'core',
    });

    expect(snapshot.trace).toContain('domain:core');
    expect(service.explain(snapshot)).toContain('core');
  });

  it('decodes valid codec payloads and surfaces invalid ones', () => {
    const valid = decodeWithCodec(DomainSnapshotCodec, {
      id: 'core-001',
      summary: 'ok',
      status: 'draft',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      domain: 'core',
    });

    const invalid = decodeWithCodec(DomainSnapshotCodec, { id: 'broken' });

    expect(valid.ok).toBe(true);
    expect(invalid.ok).toBe(false);
  });
});
