import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { StoredRecordSchema } from './types.js';

export const StoredRecordCodec = t.type({
  id: t.string,
  key: t.string,
  scope: t.union([
    t.literal('artifacts'),
    t.literal('memory'),
    t.literal('state'),
    t.literal('telemetry'),
  ]),
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  payload: t.UnknownRecord,
});

export type _StoredRecordExact = Exact<
  StoredRecordSchema,
  t.TypeOf<typeof StoredRecordCodec>
>;
