import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { DiscordControlRequest } from './types.js';

export const DiscordControlRequestCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  actorId: t.string,
  threadId: t.string,
  channelId: t.string,
  action: t.union([
    t.literal('run-this'),
    t.literal('approve-this'),
    t.literal('pause-this'),
    t.literal('rebase-all-dependents'),
    t.literal('retry-gates'),
    t.literal('merge-now'),
  ]),
  privileged: t.boolean,
});

export type _DiscordControlRequestExact = Exact<
  DiscordControlRequest,
  t.TypeOf<typeof DiscordControlRequestCodec>
>;
