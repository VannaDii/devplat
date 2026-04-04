import { describe, expect, it } from 'vitest';

import {
  createOpenClawPluginConfig,
  createOpenClawPluginConfigFromRuntimeConfig,
  describeOpenClawPluginConfig,
} from './logic.js';

describe('OpenClawPluginConfig logic', () => {
  it('normalizes plugin config and appends a trace marker', () => {
    const config = createOpenClawPluginConfig({
      id: 'openclaw-config',
      summary: '  OpenClaw adapter layer for DevPlat.  ',
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
    expect(describeOpenClawPluginConfig(config)).toContain('guild-1');
  });

  it('builds plugin config from runtime config without losing thread binding policy', () => {
    const config = createOpenClawPluginConfigFromRuntimeConfig({
      id: 'runtime-config',
      summary: 'Runtime config',
      status: 'approved',
      trace: ['config:load-runtime-config'],
      updatedAt: '2026-04-04T00:00:00.000Z',
      githubOwner: 'VannaDii',
      githubRepo: 'devplat',
      discord: {
        defaultGuildId: 'guild-9',
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
        projectKey: 'VannaDii_devplat',
        minimumCoverage: 90,
      },
    });

    expect(config.id).toBe('@vannadii/devplat-openclaw:config');
    expect(config.threadBindingMode).toBe('inherit-parent');
    expect(config.trace).toContain('openclaw:plugin-config');
  });
});
