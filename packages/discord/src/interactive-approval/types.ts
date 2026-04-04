import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordApprovalAction = 'approve' | 'retry' | 'merge' | 'escalate';

export interface DiscordApprovalRequest {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  actorId: string;
  channelId: string;
  threadId: string;
  action: DiscordApprovalAction;
  artifactId: string;
  privileged: boolean;
}

export interface DiscordApprovalResult {
  request: DiscordApprovalRequest;
  policyDecisionId: string;
  allowed: boolean;
  artifactId: string;
  persistedKey: string;
}
