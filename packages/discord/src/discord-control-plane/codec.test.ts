import { describe, expect, it } from 'vitest';

import { decodeWithCodec } from '@vannadii/devplat-core';

import { DiscordControlRequestCodec } from './codec.js';

describe('discord control request codec', () => {
  const cases = [
    {
      name: 'decode valid control requests including the expanded operator surface',
      inputs: {
        values: [
          {
            id: 'control-1',
            summary: 'Sync the bound worktree.',
            status: 'review',
            trace: [],
            updatedAt: '2026-04-04T00:00:00.000Z',
            actorId: 'operator-1',
            threadId: 'thread-1',
            channelId: 'channel-1',
            action: 'sync-worktree',
            privileged: true,
          },
          {
            id: 'control-2',
            summary: 'Explain the latest failure.',
            status: 'review',
            trace: [],
            updatedAt: '2026-04-04T00:00:00.000Z',
            actorId: 'operator-1',
            threadId: 'thread-1',
            channelId: 'channel-1',
            action: 'explain-failure',
            privileged: false,
          },
        ],
      },
      mock: async ({ values }) =>
        values.map((value) =>
          decodeWithCodec(DiscordControlRequestCodec, value),
        ),
      assert: (decodedValues) => {
        expect(decodedValues.every((decoded) => decoded.ok)).toBe(true);
      },
    },
    {
      name: 'reject invalid control requests',
      inputs: {
        values: [
          {
            id: 'control-3',
            summary: 'Unknown action.',
            status: 'review',
            trace: [],
            updatedAt: '2026-04-04T00:00:00.000Z',
            actorId: 'operator-1',
            threadId: 'thread-1',
            channelId: 'channel-1',
            action: 'merge-later',
            privileged: false,
          },
        ],
      },
      mock: async ({ values }) =>
        values.map((value) =>
          decodeWithCodec(DiscordControlRequestCodec, value),
        ),
      assert: (decodedValues) => {
        expect(decodedValues.every((decoded) => !decoded.ok)).toBe(true);
      },
    },
  ];

  it.each(cases)('$name', async (testCase) => {
    const outcome = await testCase.mock(testCase.inputs);
    testCase.assert(outcome);
  });
});
