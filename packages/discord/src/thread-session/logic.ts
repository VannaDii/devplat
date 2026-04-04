import { appendTrace } from '@vannadii/devplat-core';

import type { DiscordThreadSession } from './types.js';

function assertIdentifier(name: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`Discord thread session ${name} must not be empty.`);
  }
}

export function createDiscordThreadSession(
  input: DiscordThreadSession,
): DiscordThreadSession {
  assertIdentifier('guildId', input.guildId);
  assertIdentifier('channelId', input.channelId);
  assertIdentifier('parentChannelId', input.parentChannelId);
  assertIdentifier('threadId', input.threadId);
  assertIdentifier('artifactId', input.artifactId);

  if (input.kind === 'spec' && input.specId === null) {
    throw new Error('Spec threads must be linked to a specId.');
  }

  if (input.kind === 'spec' && input.sliceId !== null) {
    throw new Error(
      'Spec threads must not be linked to implementation slices.',
    );
  }

  if (input.kind === 'implementation' && input.sliceId === null) {
    throw new Error('Implementation threads must be linked to a sliceId.');
  }

  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `discord:thread:${input.kind}:${input.threadId}`,
  );
}

export function describeDiscordThreadSession(
  input: DiscordThreadSession,
): string {
  return `${input.kind}:${input.threadId} -> ${input.summary}`;
}
