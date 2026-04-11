import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordBindingKind =
  | 'spec'
  | 'implementation'
  | 'pull-request'
  | 'audit';

export interface DiscordChannelBinding {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  guildId: string;
  channelId: string;
  kind: DiscordBindingKind;
  threadBindingMode: 'inherit-parent';
}

export interface DiscordThreadBindingResult {
  binding: DiscordChannelBinding;
  threadId: string;
  parentChannelId: string;
  routingKey: string;
  inherited: true;
  persistedKey: string;
}
