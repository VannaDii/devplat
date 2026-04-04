import { describe, expect, it } from 'vitest';

import { createAuditLogArtifact, describeAuditLogArtifact } from './logic.js';

describe('AuditLogArtifact logic', () => {
  it('normalizes audit log artifacts', () => {
    const artifact = createAuditLogArtifact({
      id: 'artifact-audit-1',
      artifactType: 'ignored',
      version: 1,
      summary: ' Audit event ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        auditId: ' audit-1 ',
        actorId: ' operator-1 ',
        action: ' retry-gates ',
        scope: ' discord ',
        details: {
          threadId: 'thread-1',
        },
      },
    });

    expect(artifact.artifactType).toBe('audit-log');
    expect(artifact.payload).toMatchObject({
      auditId: 'audit-1',
      actorId: 'operator-1',
      action: 'retry-gates',
      scope: 'discord',
    });
  });

  it('describes audit log artifacts', () => {
    const description = describeAuditLogArtifact({
      id: 'artifact-audit-1',
      artifactType: 'audit-log',
      version: 1,
      summary: 'Audit event',
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

    expect(description).toContain('discord:retry-gates');
  });
});
