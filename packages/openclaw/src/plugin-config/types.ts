import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface OpenClawPluginConfig {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  defaultGuildId: string;
  specChannelId: string;
  implementationChannelId: string;
  auditChannelId: string;
  actionGates: {
    approveThis: boolean;
    mergeNow: boolean;
    retryGates: boolean;
    rebaseAllDependents: boolean;
  };
}
