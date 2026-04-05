import { describe, expect, it } from 'vitest';

import { ArtifactValidationService } from './service.js';

describe('ArtifactValidationService', () => {
  it('executes and explains validated artifacts', () => {
    const service = new ArtifactValidationService();
    const result = service.execute({
      id: 'artifact-audit-1',
      artifactType: 'audit-log',
      version: 1,
      summary: ' Audit event ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        auditId: 'audit-1',
        actorId: 'operator-1',
        action: 'retry-gates',
        scope: 'discord',
        details: {
          threadId: 'thread-1',
        },
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(service.explain(result.value)).toBe('audit-log@v1');
    }
  });
});
