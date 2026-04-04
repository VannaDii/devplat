import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { DevplatConfig } from './types.js';

export const DevplatConfigCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  githubOwner: t.string,
  githubRepo: t.string,
  discord: t.type({
    defaultGuildId: t.string,
    specChannelId: t.string,
    implementationChannelId: t.string,
    auditChannelId: t.string,
    threadBindingMode: t.literal('inherit-parent'),
  }),
  openclaw: t.type({
    pluginId: t.string,
    actionGates: t.type({
      approveThis: t.boolean,
      mergeNow: t.boolean,
      retryGates: t.boolean,
      rebaseAllDependents: t.boolean,
    }),
  }),
  sonar: t.type({
    organization: t.string,
    projectKey: t.string,
    minimumCoverage: t.literal(90),
  }),
});

export type _DevplatConfigExact = Exact<
  DevplatConfig,
  t.TypeOf<typeof DevplatConfigCodec>
>;
