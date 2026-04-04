import { describe, expect, it } from 'vitest';

import { ResearchBriefService } from './service.js';

describe('ResearchBriefService', () => {
  it('creates research artifacts from normalized briefs', () => {
    const service = new ResearchBriefService();
    const snapshot = service.execute({
      researchId: 'research-001',
      topic: 'Discord operations',
      question: 'How should approvals be modeled?',
      constraints: ['auditable'],
      findings: ['Use thread-aware controls'],
      recommendation: 'Use Discord components for explicit approvals.',
      sourceUrls: ['https://example.com/discord'],
      updatedAt: '2026-04-04T00:00:00.000Z',
    });
    const artifact = service.toArtifact(snapshot);

    expect(artifact.artifactType).toBe('research-brief');
    expect(artifact.payload).toMatchObject({ researchId: 'research-001' });
    expect(service.explain(snapshot)).toContain('Research brief');
  });
});
