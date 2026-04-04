import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type {
  DiscordThreadSession,
  DiscordThreadSessionResult,
} from './types.js';

export const DiscordThreadSessionCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  guildId: t.string,
  channelId: t.string,
  parentChannelId: t.string,
  threadId: t.string,
  kind: t.union([t.literal('spec'), t.literal('implementation')]),
  specId: t.union([t.string, t.null]),
  sliceId: t.union([t.string, t.null]),
  artifactId: t.string,
});

export const DiscordThreadSessionResultCodec = t.type({
  session: DiscordThreadSessionCodec,
  artifactId: t.string,
  persistedKey: t.string,
});

export type _DiscordThreadSessionExact = Exact<
  DiscordThreadSession,
  t.TypeOf<typeof DiscordThreadSessionCodec>
>;

export type _DiscordThreadSessionResultExact = Exact<
  DiscordThreadSessionResult,
  t.TypeOf<typeof DiscordThreadSessionResultCodec>
>;
