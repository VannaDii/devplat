import {
  createArtifactEnvelope,
  describeArtifactEnvelope,
} from '../artifact-envelope/logic.js';
import type { ApprovalRecordArtifact } from './types.js';

export function createApprovalRecordArtifact(
  input: ApprovalRecordArtifact,
): ApprovalRecordArtifact {
  return createArtifactEnvelope({
    ...input,
    artifactType: 'approval-record',
    version: 1,
    payload: {
      ...input.payload,
      approvalId: input.payload.approvalId.trim(),
      subjectId: input.payload.subjectId.trim(),
      actorId: input.payload.actorId.trim(),
      rationale: input.payload.rationale.trim(),
    },
  });
}

export function describeApprovalRecordArtifact(
  input: ApprovalRecordArtifact,
): string {
  return `${describeArtifactEnvelope(input)} :: ${input.payload.decision} ${input.payload.subjectType} ${input.payload.subjectId}`;
}
