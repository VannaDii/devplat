import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { OpenClawPluginConfig } from './types.js';

export const OpenClawPluginConfigCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  defaultGuildId: t.string,
  specChannelId: t.string,
  implementationChannelId: t.string,
  auditChannelId: t.string,
  threadBindingMode: t.literal('inherit-parent'),
  actionGates: t.type({
    approveThis: t.boolean,
    mergeNow: t.boolean,
    retryGates: t.boolean,
    rebaseAllDependents: t.boolean,
  }),
});

export type _OpenClawPluginConfigExact = Exact<
  OpenClawPluginConfig,
  t.TypeOf<typeof OpenClawPluginConfigCodec>
>;
