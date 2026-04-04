import { describe, expect, it } from 'vitest';

import { ReviewFindingsService } from './service.js';

describe('ReviewFindingsService', () => {
  it('turns review findings into machine-readable artifacts', () => {
    const service = new ReviewFindingsService();
    const snapshot = service.execute({
      findingId: 'finding-001',
      severity: 'critical',
      path: 'packages/storage/src/file-store/service.ts',
      message: 'Storage bypass detected.',
      rationale: 'Direct filesystem access must stay isolated.',
      fixRecommendation: 'Route writes through the storage service only.',
      blocking: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const artifact = service.toArtifact(snapshot);

    expect(artifact.status).toBe('failed');
    expect(artifact.payload).toMatchObject({ findingId: 'finding-001' });
    expect(service.explain(snapshot)).toContain('critical finding');
  });

  it('emits review-status artifacts for non-blocking findings', () => {
    const service = new ReviewFindingsService();
    const snapshot = service.execute({
      findingId: 'finding-002',
      severity: 'low',
      path: 'packages/core/src/domain/logic.ts',
      message: 'Minor docs gap.',
      rationale: 'No behavioral impact.',
      fixRecommendation: 'Clarify the summary string.',
      blocking: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const artifact = service.toArtifact(snapshot);

    expect(artifact.status).toBe('review');
  });
});
