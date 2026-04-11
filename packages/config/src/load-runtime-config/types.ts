import type { LifecycleStatus } from '@vannadii/devplat-core';

export type DiscordApiVersion = 'v10';

export type DiscordInstallScope = 'bot' | 'applications.commands';

export type DiscordPermission =
  | 'ViewChannel'
  | 'SendMessages'
  | 'CreatePublicThreads'
  | 'CreatePrivateThreads'
  | 'SendMessagesInThreads'
  | 'ManageThreads'
  | 'ReadMessageHistory';

export interface DiscordRuntimeConfig {
  apiBaseUrl: string;
  apiVersion: DiscordApiVersion;
  applicationId: string;
  publicKey: string;
  botToken: string;
  installScopes: readonly DiscordInstallScope[];
  requiredPermissions: readonly DiscordPermission[];
  defaultGuildId: string;
  specChannelId: string;
  implementationChannelId: string;
  pullRequestChannelId: string;
  auditChannelId: string;
  projectManagementChannelId: string;
  threadBindingMode: 'inherit-parent';
}

export interface OpenClawActionGateConfig {
  approveThis: boolean;
  mergeNow: boolean;
  retryGates: boolean;
  rebaseAllDependents: boolean;
}

export interface DevplatConfig {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  githubOwner: string;
  githubRepo: string;
  discord: DiscordRuntimeConfig;
  openclaw: {
    pluginId: string;
    actionGates: OpenClawActionGateConfig;
  };
  sonar: {
    organization: string;
    projectKey: string;
    minimumCoverage: 90;
  };
}
