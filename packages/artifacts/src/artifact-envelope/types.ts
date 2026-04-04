import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface ArtifactEnvelope<
  TPayload extends object = Record<string, unknown>,
> {
  id: string;
  artifactType: string;
  version: 1;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  payload: TPayload;
}

export type ArtifactEnvelopeSchema = ArtifactEnvelope;
