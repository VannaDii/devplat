import {
  createArtifactEnvelope,
  describeArtifactEnvelope,
} from '../artifact-envelope/logic.js';
import type { AuditLogArtifact } from './types.js';

export function createAuditLogArtifact(
  input: AuditLogArtifact,
): AuditLogArtifact {
  return createArtifactEnvelope({
    ...input,
    artifactType: 'audit-log',
    version: 1,
    payload: {
      ...input.payload,
      auditId: input.payload.auditId.trim(),
      actorId: input.payload.actorId.trim(),
      action: input.payload.action.trim(),
      scope: input.payload.scope.trim(),
    },
  });
}

export function describeAuditLogArtifact(input: AuditLogArtifact): string {
  return `${describeArtifactEnvelope(input)} :: ${input.payload.scope}:${input.payload.action}`;
}
