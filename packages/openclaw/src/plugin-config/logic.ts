import type { DevplatConfig } from '@vannadii/devplat-config';
import { appendTrace } from '@vannadii/devplat-core';

import type { OpenClawPluginConfig } from './types.js';

export function createOpenClawPluginConfig(
  input: OpenClawPluginConfig,
): OpenClawPluginConfig {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    'openclaw:plugin-config',
  );
}

export function describeOpenClawPluginConfig(
  input: OpenClawPluginConfig,
): string {
  return `${input.defaultGuildId}:${input.specChannelId} -> ${input.summary}`;
}

export function createOpenClawPluginConfigFromRuntimeConfig(
  input: DevplatConfig,
): OpenClawPluginConfig {
  return createOpenClawPluginConfig({
    id: `${input.openclaw.pluginId}:config`,
    summary: `OpenClaw configuration for ${input.githubOwner}/${input.githubRepo}`,
    status: input.status,
    trace: input.trace,
    updatedAt: input.updatedAt,
    defaultGuildId: input.discord.defaultGuildId,
    specChannelId: input.discord.specChannelId,
    implementationChannelId: input.discord.implementationChannelId,
    auditChannelId: input.discord.auditChannelId,
    threadBindingMode: input.discord.threadBindingMode,
    actionGates: input.openclaw.actionGates,
  });
}
