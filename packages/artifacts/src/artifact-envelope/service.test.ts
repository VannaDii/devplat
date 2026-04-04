import { describe, expect, it } from 'vitest';

import { ArtifactEnvelopeService } from './service.js';

describe('ArtifactEnvelopeService', () => {
  it('delegates to the unit logic', () => {
    const service = new ArtifactEnvelopeService();
    const envelope = service.execute({
      id: 'artifact-001',
      artifactType: 'review-findings',
      version: 1,
      summary: 'review complete',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        findingCount: 0,
      },
    });

    expect(envelope.trace).toContain('artifact:review-findings');
    expect(service.explain(envelope)).toContain('review-findings');
  });
});
