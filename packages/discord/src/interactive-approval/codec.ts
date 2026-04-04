import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type { DiscordApprovalRequest, DiscordApprovalResult } from './types.js';

export const DiscordApprovalRequestCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  actorId: t.string,
  channelId: t.string,
  threadId: t.string,
  action: t.union([
    t.literal('approve'),
    t.literal('retry'),
    t.literal('merge'),
    t.literal('escalate'),
  ]),
  artifactId: t.string,
  privileged: t.boolean,
});

export const DiscordApprovalResultCodec = t.type({
  request: DiscordApprovalRequestCodec,
  policyDecisionId: t.string,
  allowed: t.boolean,
  artifactId: t.string,
  persistedKey: t.string,
});

export type _DiscordApprovalRequestExact = Exact<
  DiscordApprovalRequest,
  t.TypeOf<typeof DiscordApprovalRequestCodec>
>;

export type _DiscordApprovalResultExact = Exact<
  DiscordApprovalResult,
  t.TypeOf<typeof DiscordApprovalResultCodec>
>;
