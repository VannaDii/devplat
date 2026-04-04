import { describe, expect, it } from 'vitest';

import {
  createOpenClawPluginConfig,
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
});
