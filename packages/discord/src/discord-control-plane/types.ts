import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordControlAction =
  | 'run-this'
  | 'approve-this'
  | 'pause-this'
  | 'rebase-all-dependents'
  | 'retry-gates'
  | 'merge-now';

export interface DiscordControlRequest {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  actorId: string;
  threadId: string;
  channelId: string;
  action: DiscordControlAction;
  privileged: boolean;
}

export interface DiscordControlResult {
  request: DiscordControlRequest;
  policyDecisionId: string;
  allowed: boolean;
  persistedKey: string;
}
