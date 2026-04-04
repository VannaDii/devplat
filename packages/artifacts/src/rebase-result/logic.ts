import {
  createArtifactEnvelope,
  describeArtifactEnvelope,
} from '../artifact-envelope/logic.js';
import type { RebaseResultArtifact } from './types.js';

export function createRebaseResultArtifact(
  input: RebaseResultArtifact,
): RebaseResultArtifact {
  return createArtifactEnvelope({
    ...input,
    artifactType: 'rebase-result',
    version: 1,
    payload: {
      ...input.payload,
      resultId: input.payload.resultId.trim(),
      baseBranch: input.payload.baseBranch.trim(),
      branchName: input.payload.branchName.trim(),
      details: input.payload.details.trim(),
    },
  });
}

export function describeRebaseResultArtifact(
  input: RebaseResultArtifact,
): string {
  return `${describeArtifactEnvelope(input)} :: ${input.payload.branchName} ${input.payload.rebased ? 'rebased' : 'not rebased'}`;
}
