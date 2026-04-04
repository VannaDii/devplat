import { describe, expect, it } from 'vitest';

import { RuntimeConfigService } from './service.js';

describe('RuntimeConfigService', () => {
  it('loads defaults from environment values', () => {
    const service = new RuntimeConfigService();
    const config = service.fromEnvironment({});

    expect(config.githubOwner).toBe('VannaDii');
    expect(service.explain(config)).toContain('devplat');
  });

  it('respects environment overrides and exposes execute as a pass-through', () => {
    const service = new RuntimeConfigService();
    const config = service.fromEnvironment({
      GITHUB_OWNER: 'AcmeOrg',
      GITHUB_REPO: 'platform',
      DISCORD_SPEC_CHANNEL_ID: 'specs',
      DISCORD_IMPLEMENTATION_CHANNEL_ID: 'impl',
      DISCORD_AUDIT_CHANNEL_ID: 'audit',
      OPENCLAW_PLUGIN_ID: '@acme/platform-openclaw',
      SONAR_ORGANIZATION: 'AcmeOrg',
      SONAR_PROJECT_KEY: 'AcmeOrg_platform',
    });

    expect(config.githubOwner).toBe('AcmeOrg');
    expect(config.githubRepo).toBe('platform');
    expect(config.openclaw.pluginId).toBe('@acme/platform-openclaw');
    expect(service.execute(config)).toBe(config);
  });
});
