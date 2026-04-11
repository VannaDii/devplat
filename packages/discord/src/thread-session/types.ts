import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordThreadKind = 'spec' | 'implementation' | 'pull-request';

interface DiscordThreadSessionBase {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  guildId: string;
  channelId: string;
  parentChannelId: string;
  threadId: string;
  artifactId: string;
}

export interface DiscordThreadSessionInput extends DiscordThreadSessionBase {
  kind: DiscordThreadKind;
  specId: string | null;
  sliceId: string | null;
  pullRequestNumber: number | null;
}

export interface DiscordSpecThreadSession extends DiscordThreadSessionBase {
  kind: 'spec';
  specId: string;
  sliceId: null;
  pullRequestNumber: null;
}

export interface DiscordImplementationThreadSession extends DiscordThreadSessionBase {
  kind: 'implementation';
  specId: string | null;
  sliceId: string;
  pullRequestNumber: null;
}

export interface DiscordPullRequestThreadSession extends DiscordThreadSessionBase {
  kind: 'pull-request';
  specId: string | null;
  sliceId: string | null;
  /**
   * @asType integer
   * @minimum 1
   */
  pullRequestNumber: number;
}

export type DiscordThreadSession =
  | DiscordSpecThreadSession
  | DiscordImplementationThreadSession
  | DiscordPullRequestThreadSession;

export interface DiscordThreadSessionResult {
  session: DiscordThreadSession;
  artifactId: string;
  persistedKey: string;
}
