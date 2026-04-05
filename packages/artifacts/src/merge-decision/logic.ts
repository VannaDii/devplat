import {
  createArtifactEnvelope,
  describeArtifactEnvelope,
} from '../artifact-envelope/logic.js';
import type { MergeDecisionArtifact } from './types.js';

export function createMergeDecisionArtifact(
  input: MergeDecisionArtifact,
): MergeDecisionArtifact {
  return createArtifactEnvelope({
    ...input,
    artifactType: 'merge-decision',
    version: 1,
    payload: {
      ...input.payload,
      decisionId: input.payload.decisionId.trim(),
      actorId: input.payload.actorId.trim(),
      rationale: input.payload.rationale.trim(),
      blockingFindings: input.payload.blockingFindings.map((finding) =>
        finding.trim(),
      ),
    },
  });
}

export function describeMergeDecisionArtifact(
  input: MergeDecisionArtifact,
): string {
  return `${describeArtifactEnvelope(input)} :: pr #${String(input.payload.prNumber)} ${input.payload.approved ? 'approved' : 'blocked'}`;
}
