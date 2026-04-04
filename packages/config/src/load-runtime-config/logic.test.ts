import { describe, expect, it } from 'vitest';

import { createDefaultDevplatConfig, describeDevplatConfig } from './logic.js';

describe('DevplatConfig logic', () => {
  it('creates a default config from environment overrides', () => {
    const config = createDefaultDevplatConfig({
      GITHUB_OWNER: 'VannaDii',
      GITHUB_REPO: 'devplat',
    });

    expect(config.trace).toContain('config:load-runtime-config');
    expect(config.discord.defaultGuildId).toBe('devplat-guild');
    expect(config.discord.threadBindingMode).toBe('inherit-parent');
    expect(config.sonar.minimumCoverage).toBe(90);
    expect(describeDevplatConfig(config)).toContain('VannaDii/devplat');
  });
});
