import { appendTrace } from '@vannadii/devplat-core';

import type { ArtifactEnvelope } from './types.js';

export function createArtifactEnvelope<TPayload extends object>(
  input: ArtifactEnvelope<TPayload>,
): ArtifactEnvelope<TPayload> {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `artifact:${input.artifactType}`,
  );
}

export function describeArtifactEnvelope<TPayload extends object>(
  input: ArtifactEnvelope<TPayload>,
): string {
  return `${input.artifactType}@v${String(input.version)} -> ${input.summary}`;
}
