import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { GateRunReport } from './types.js';

export const GateCheckResultCodec = t.type({
  name: t.string,
  success: t.boolean,
  detail: t.string,
});

export const GateRunReportCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  passed: t.boolean,
  results: t.array(GateCheckResultCodec),
});

export type _GateRunReportExact = Exact<
  GateRunReport,
  t.TypeOf<typeof GateRunReportCodec>
>;
