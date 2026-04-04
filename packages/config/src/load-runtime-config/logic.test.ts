import { describe, expect, it } from 'vitest';

import { createDefaultDevplatConfig, describeDevplatConfig } from './logic.js';

describe('DevplatConfig logic', () => {
  it('creates a default config from environment overrides', () => {
    const config = createDefaultDevplatConfig({
      GITHUB_OWNER: 'VannaDii',
      GITHUB_REPO: 'devplat',
    });

    expect(config.trace).toContain('config:load-runtime-config');
    expect(config.sonar.minimumCoverage).toBe(90);
    expect(describeDevplatConfig(config)).toContain('VannaDii/devplat');
  });
});
