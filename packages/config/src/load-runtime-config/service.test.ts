import { describe, expect, it } from 'vitest';

import { RuntimeConfigService } from './service.js';

describe('RuntimeConfigService', () => {
  const cases = [
    {
      name: 'loads defaults from environment values',
      inputs: {
        env: {},
      },
      mock: ({ env }: { env: Record<string, string> }) =>
        new RuntimeConfigService().fromEnvironment(env),
      assert: (config: ReturnType<RuntimeConfigService['fromEnvironment']>) => {
        expect(config.githubOwner).toBe('VannaDii');
        expect(config.discord.apiVersion).toBe('v10');
        expect(config.discord.projectManagementChannelId).toBe(
          'project-management-channel',
        );
        expect(new RuntimeConfigService().explain(config)).toContain('devplat');
      },
    },
    {
      name: 'respects environment overrides and exposes execute as a pass-through',
      inputs: {
        env: {
          GITHUB_OWNER: 'AcmeOrg',
          GITHUB_REPO: 'platform',
          DISCORD_API_BASE_URL: 'https://discord.com/api/v10',
          DISCORD_APPLICATION_ID: 'application-7',
          DISCORD_PUBLIC_KEY: 'public-key-7',
          DISCORD_BOT_TOKEN: 'bot-token-7',
          DISCORD_DEFAULT_GUILD_ID: 'guild-7',
          DISCORD_SPEC_CHANNEL_ID: 'specs',
          DISCORD_IMPLEMENTATION_CHANNEL_ID: 'impl',
          DISCORD_PULL_REQUEST_CHANNEL_ID: 'prs',
          DISCORD_AUDIT_CHANNEL_ID: 'audit',
          DISCORD_PROJECT_MANAGEMENT_CHANNEL_ID: 'pm',
          OPENCLAW_PLUGIN_ID: '@acme/platform-openclaw',
          SONAR_ORGANIZATION: 'AcmeOrg',
          SONAR_PROJECT_KEY: 'AcmeOrg_platform',
        },
      },
      mock: ({ env }: { env: Record<string, string> }) =>
        new RuntimeConfigService().fromEnvironment(env),
      assert: (config: ReturnType<RuntimeConfigService['fromEnvironment']>) => {
        const service = new RuntimeConfigService();

        expect(config.githubOwner).toBe('AcmeOrg');
        expect(config.githubRepo).toBe('platform');
        expect(config.discord.applicationId).toBe('application-7');
        expect(config.discord.defaultGuildId).toBe('guild-7');
        expect(config.discord.pullRequestChannelId).toBe('prs');
        expect(config.discord.projectManagementChannelId).toBe('pm');
        expect(config.openclaw.pluginId).toBe('@acme/platform-openclaw');
        expect(service.execute(config)).toBe(config);
      },
    },
  ];

  it.each(cases)('$name', ({ inputs, mock, assert }) => {
    assert(mock(inputs));
  });
});
