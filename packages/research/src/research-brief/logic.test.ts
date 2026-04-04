import { describe, expect, it } from 'vitest';

import { createResearchBrief, describeResearchBrief } from './logic.js';

describe('ResearchBrief logic', () => {
  it('normalizes research detail lists', () => {
    const snapshot = createResearchBrief({
      researchId: 'research-001',
      topic: '  OpenClaw Discord operations  ',
      question: '  What Discord primitives should DevPlat rely on?  ',
      constraints: ['Discord threads', 'Discord threads', 'auditable'],
      findings: ['Thread sessions already isolate context', ''],
      recommendation: '  Treat Discord as the primary control plane.  ',
      sourceUrls: [
        'https://example.com/openclaw',
        'https://example.com/openclaw',
      ],
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.topic).toBe('OpenClaw Discord operations');
    expect(snapshot.constraints).toEqual(['Discord threads', 'auditable']);
    expect(snapshot.sourceUrls).toEqual(['https://example.com/openclaw']);
    expect(describeResearchBrief(snapshot)).toContain('Research brief');
  });
});
