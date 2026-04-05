import { describe, expect, it } from 'vitest';

import { AuditLogArtifactService } from './service.js';

describe('AuditLogArtifactService', () => {
  it('executes and explains audit log artifacts', () => {
    const service = new AuditLogArtifactService();
    const artifact = service.execute({
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

    expect(artifact.summary).toBe('Audit event');
    expect(service.explain(artifact)).toContain('audit-log');
  });
});
