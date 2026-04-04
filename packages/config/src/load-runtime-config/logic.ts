import { appendTrace } from '@vannadii/devplat-core';

import type { DevplatConfig } from './types.js';

export function createDevplatConfig(input: DevplatConfig): DevplatConfig {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    'config:load-runtime-config',
  );
}

export function createDefaultDevplatConfig(
  env: Record<string, string | undefined>,
): DevplatConfig {
  return createDevplatConfig({
    id: 'devplat-config',
    summary: 'Resolved DevPlat runtime configuration',
    status: 'approved',
    trace: [],
    updatedAt: new Date().toISOString(),
    githubOwner: env['GITHUB_OWNER'] ?? 'VannaDii',
    githubRepo: env['GITHUB_REPO'] ?? 'devplat',
    discord: {
      defaultGuildId: env['DISCORD_DEFAULT_GUILD_ID'] ?? 'devplat-guild',
      specChannelId: env['DISCORD_SPEC_CHANNEL_ID'] ?? 'spec-channel',
      implementationChannelId:
        env['DISCORD_IMPLEMENTATION_CHANNEL_ID'] ?? 'implementation-channel',
      auditChannelId: env['DISCORD_AUDIT_CHANNEL_ID'] ?? 'audit-channel',
      threadBindingMode: 'inherit-parent',
    },
    openclaw: {
      pluginId: env['OPENCLAW_PLUGIN_ID'] ?? '@vannadii/devplat-openclaw',
      actionGates: {
        approveThis: true,
        mergeNow: false,
        retryGates: true,
        rebaseAllDependents: false,
      },
    },
    sonar: {
      organization: env['SONAR_ORGANIZATION'] ?? 'VannaDii',
      projectKey: env['SONAR_PROJECT_KEY'] ?? 'VannaDii_devplat',
      minimumCoverage: 90,
    },
  });
}

export function describeDevplatConfig(config: DevplatConfig): string {
  return `${config.githubOwner}/${config.githubRepo} -> ${config.summary}`;
}
