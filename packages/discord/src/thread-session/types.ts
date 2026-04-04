import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordThreadKind = 'spec' | 'implementation';

export interface DiscordThreadSession {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  guildId: string;
  channelId: string;
  parentChannelId: string;
  threadId: string;
  kind: DiscordThreadKind;
  specId: string | null;
  sliceId: string | null;
  artifactId: string;
}

export interface DiscordThreadSessionResult {
  session: DiscordThreadSession;
  artifactId: string;
  persistedKey: string;
}
