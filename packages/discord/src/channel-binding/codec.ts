import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type {
  DiscordChannelBinding,
  DiscordThreadBindingResult,
} from './types.js';

export const DiscordChannelBindingCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  guildId: t.string,
  channelId: t.string,
  kind: t.union([
    t.literal('spec'),
    t.literal('implementation'),
    t.literal('pull-request'),
    t.literal('audit'),
  ]),
  threadBindingMode: t.literal('inherit-parent'),
});

export const DiscordThreadBindingResultCodec = t.type({
  binding: DiscordChannelBindingCodec,
  threadId: t.string,
  parentChannelId: t.string,
  routingKey: t.string,
  inherited: t.literal(true),
  persistedKey: t.string,
});

export type _DiscordChannelBindingExact = Exact<
  DiscordChannelBinding,
  t.TypeOf<typeof DiscordChannelBindingCodec>
>;

export type _DiscordThreadBindingResultExact = Exact<
  DiscordThreadBindingResult,
  t.TypeOf<typeof DiscordThreadBindingResultCodec>
>;
