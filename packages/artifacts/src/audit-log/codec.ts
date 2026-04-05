import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { AuditLogArtifact } from './types.js';

export const AuditLogPayloadCodec = t.type({
  auditId: t.string,
  actorId: t.string,
  action: t.string,
  scope: t.string,
  details: t.UnknownRecord,
});

export const AuditLogArtifactCodec = t.type({
  id: t.string,
  artifactType: t.literal('audit-log'),
  version: t.literal(1),
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  payload: AuditLogPayloadCodec,
});

export type _AuditLogArtifactExact = Exact<
  AuditLogArtifact,
  t.TypeOf<typeof AuditLogArtifactCodec>
>;
