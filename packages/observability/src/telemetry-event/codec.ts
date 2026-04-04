import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { TelemetryEvent } from './types.js';

export const TelemetryEventCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  actorId: t.string,
  action: t.string,
  scope: t.union([
    t.literal('discord'),
    t.literal('github'),
    t.literal('supervisor'),
    t.literal('storage'),
  ]),
  details: t.UnknownRecord,
});

export type _TelemetryEventExact = Exact<
  TelemetryEvent,
  t.TypeOf<typeof TelemetryEventCodec>
>;
