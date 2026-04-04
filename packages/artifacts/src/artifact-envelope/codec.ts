import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { ArtifactEnvelopeSchema } from './types.js';

export const ArtifactEnvelopeCodec = t.type({
  id: t.string,
  artifactType: t.string,
  version: t.literal(1),
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  payload: t.UnknownRecord,
});

export type _ArtifactEnvelopeExact = Exact<
  ArtifactEnvelopeSchema,
  t.TypeOf<typeof ArtifactEnvelopeCodec>
>;
