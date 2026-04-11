import { describe, expect, it } from 'vitest';

import { createDefaultDevplatConfig, describeDevplatConfig } from './logic.js';

describe('DevplatConfig logic', () => {
  const cases = [
    {
      name: 'creates a default config from environment overrides',
      inputs: {
        env: {
          GITHUB_OWNER: 'VannaDii',
          GITHUB_REPO: 'devplat',
        },
      },
      mock: ({ env }: { env: Record<string, string> }) =>
        createDefaultDevplatConfig(env),
      assert: (config: ReturnType<typeof createDefaultDevplatConfig>) => {
        expect(config.trace).toContain('config:load-runtime-config');
        expect(config.discord.apiBaseUrl).toBe('https://discord.com/api/v10');
        expect(config.discord.apiVersion).toBe('v10');
        expect(config.discord.installScopes).toEqual([
          'bot',
          'applications.commands',
        ]);
        expect(config.discord.requiredPermissions).toEqual([
          'ViewChannel',
          'SendMessages',
          'CreatePublicThreads',
          'CreatePrivateThreads',
          'SendMessagesInThreads',
          'ManageThreads',
          'ReadMessageHistory',
        ]);
        expect(config.discord.defaultGuildId).toBe('devplat-guild');
        expect(config.discord.pullRequestChannelId).toBe(
          'pull-request-channel',
        );
        expect(config.discord.projectManagementChannelId).toBe(
          'project-management-channel',
        );
        expect(config.discord.threadBindingMode).toBe('inherit-parent');
        expect(config.sonar.minimumCoverage).toBe(90);
        expect(describeDevplatConfig(config)).toContain('VannaDii/devplat');
      },
    },
  ];

  it.each(cases)('$name', ({ inputs, mock, assert }) => {
    assert(mock(inputs));
  });
});
