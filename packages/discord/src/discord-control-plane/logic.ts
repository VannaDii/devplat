import { appendTrace } from '@vannadii/devplat-core';

import type { DiscordControlRequest } from './types.js';

export function createDiscordControlRequest(
  input: DiscordControlRequest,
): DiscordControlRequest {
  if (input.threadId.trim().length === 0) {
    throw new Error('Discord control requests must be scoped to a thread.');
  }

  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `discord:${input.threadId}:${input.action}`,
  );
}

export function describeDiscordControlRequest(
  input: DiscordControlRequest,
): string {
  return `${input.threadId}:${input.action} -> ${input.summary}`;
}
