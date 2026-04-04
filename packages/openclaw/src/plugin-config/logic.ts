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
