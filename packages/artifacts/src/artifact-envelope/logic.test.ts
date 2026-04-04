import { describe, expect, it } from 'vitest';

import { createArtifactEnvelope, describeArtifactEnvelope } from './logic.js';

describe('ArtifactEnvelope logic', () => {
  it('normalizes the summary and appends an artifact trace marker', () => {
    const envelope = createArtifactEnvelope({
      id: 'artifact-001',
      artifactType: 'gate-run-report',
      version: 1,
      summary: '  gate run completed  ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        passed: true,
      },
    });

    expect(envelope.summary).toBe('gate run completed');
    expect(envelope.trace).toContain('artifact:gate-run-report');
    expect(describeArtifactEnvelope(envelope)).toContain('gate-run-report');
  });
});
