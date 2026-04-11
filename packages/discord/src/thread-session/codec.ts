import * as t from 'io-ts';

import { LifecycleStatusCodec, type Exact } from '@vannadii/devplat-core';

import type {
  DiscordThreadSession,
  DiscordThreadSessionResult,
} from './types.js';

const PositivePullRequestNumberCodec = new t.Type<number, number>(
  'PositivePullRequestNumber',
  (input): input is number =>
    typeof input === 'number' && Number.isInteger(input) && input >= 1,
  (input, context) =>
    typeof input === 'number' && Number.isInteger(input) && input >= 1
      ? t.success(input)
      : t.failure(
          input,
          context,
          'pullRequestNumber must be a positive integer.',
        ),
  t.identity,
);

const DiscordThreadSessionBaseCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  guildId: t.string,
  channelId: t.string,
  parentChannelId: t.string,
  threadId: t.string,
  artifactId: t.string,
});

const DiscordThreadSpecSessionCodec = t.intersection([
  DiscordThreadSessionBaseCodec,
  t.type({
    kind: t.literal('spec'),
    specId: t.string,
    sliceId: t.null,
    pullRequestNumber: t.null,
  }),
]);

const DiscordThreadImplementationSessionCodec = t.intersection([
  DiscordThreadSessionBaseCodec,
  t.type({
    kind: t.literal('implementation'),
    specId: t.union([t.string, t.null]),
    sliceId: t.string,
    pullRequestNumber: t.null,
  }),
]);

const DiscordThreadPullRequestSessionCodec = t.intersection([
  DiscordThreadSessionBaseCodec,
  t.type({
    kind: t.literal('pull-request'),
    specId: t.union([t.string, t.null]),
    sliceId: t.union([t.string, t.null]),
    pullRequestNumber: PositivePullRequestNumberCodec,
  }),
]);

export const DiscordThreadSessionCodec: t.Type<DiscordThreadSession> = t.union([
  DiscordThreadSpecSessionCodec,
  DiscordThreadImplementationSessionCodec,
  DiscordThreadPullRequestSessionCodec,
]);

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
