import { describe, expect, it } from 'vitest';

import { PluginConfigService } from './service.js';

describe('PluginConfigService', () => {
  it('delegates to the unit logic', () => {
    const service = new PluginConfigService();
    const config = service.execute({
      id: 'openclaw-config',
      summary: 'OpenClaw adapter layer for DevPlat.',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      defaultGuildId: 'guild-1',
      specChannelId: 'specs',
      implementationChannelId: 'impl',
      auditChannelId: 'audit',
      threadBindingMode: 'inherit-parent',
      actionGates: {
        approveThis: true,
        mergeNow: false,
        retryGates: true,
        rebaseAllDependents: false,
      },
    });

    expect(config.trace).toContain('openclaw:plugin-config');
    expect(service.explain(config)).toContain('guild-1:specs');
  });

  it('derives OpenClaw config from runtime config', () => {
    const service = new PluginConfigService();
    const config = service.fromRuntimeConfig({
      id: 'devplat-config',
      summary: 'Resolved DevPlat runtime configuration',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      githubOwner: 'VannaDii',
      githubRepo: 'devplat',
      discord: {
        defaultGuildId: 'guild-1',
        specChannelId: 'specs',
        implementationChannelId: 'impl',
        auditChannelId: 'audit',
        threadBindingMode: 'inherit-parent',
      },
      openclaw: {
        pluginId: '@vannadii/devplat-openclaw',
        actionGates: {
          approveThis: true,
          mergeNow: false,
          retryGates: true,
          rebaseAllDependents: false,
        },
      },
      sonar: {
        organization: 'VannaDii',
        projectKey: 'vannadii_devplat',
        minimumCoverage: 90,
      },
    });

    expect(config.defaultGuildId).toBe('guild-1');
    expect(config.threadBindingMode).toBe('inherit-parent');
  });
});
