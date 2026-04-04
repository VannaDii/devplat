import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { SupervisorDecision } from './types.js';

export const SupervisorDecisionCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  action: t.string,
  nextState: LifecycleStatusCodec,
  approved: t.boolean,
  notes: t.array(t.string),
});

export type _SupervisorDecisionExact = Exact<
  SupervisorDecision,
  t.TypeOf<typeof SupervisorDecisionCodec>
>;
