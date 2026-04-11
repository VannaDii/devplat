import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface OpenClawPluginConfig {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  apiBaseUrl: string;
  apiVersion: 'v10';
  applicationId: string;
  publicKey: string;
  botToken: string;
  installScopes: readonly ('bot' | 'applications.commands')[];
  requiredPermissions: readonly (
    | 'ViewChannel'
    | 'SendMessages'
    | 'CreatePublicThreads'
    | 'CreatePrivateThreads'
    | 'SendMessagesInThreads'
    | 'ManageThreads'
    | 'ReadMessageHistory'
  )[];
  defaultGuildId: string;
  specChannelId: string;
  implementationChannelId: string;
  pullRequestChannelId: string;
  auditChannelId: string;
  projectManagementChannelId: string;
  threadBindingMode: 'inherit-parent';
  actionGates: {
    approveThis: boolean;
    mergeNow: boolean;
    retryGates: boolean;
    rebaseAllDependents: boolean;
  };
}
