import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface DiscordRuntimeConfig {
  specChannelId: string;
  implementationChannelId: string;
  auditChannelId: string;
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
