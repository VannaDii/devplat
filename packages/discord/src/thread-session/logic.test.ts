import { describe, expect, it } from 'vitest';

import {
  createDiscordThreadSession,
  describeDiscordThreadSession,
} from './logic.js';

describe('Discord thread session logic', () => {
  it('normalizes spec thread sessions and appends a trace marker', () => {
    const session = createDiscordThreadSession({
      id: 'thread-session-001',
      summary: '  Spec thread  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-1',
      parentChannelId: 'channel-spec',
      threadId: 'thread-1',
      kind: 'spec',
      specId: 'spec-1',
      sliceId: null,
      pullRequestNumber: null,
      artifactId: 'artifact-1',
    });

    expect(session.trace).toContain('discord:thread:spec:thread-1');
    expect(describeDiscordThreadSession(session)).toContain('spec:thread-1');
  });

  it('rejects invalid implementation thread payloads', () => {
    expect(() =>
      createDiscordThreadSession({
        id: 'thread-session-002',
        summary: 'Implementation thread',
        status: 'running',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'thread-2',
        parentChannelId: 'channel-impl',
        threadId: 'thread-2',
        kind: 'implementation',
        specId: 'spec-1',
        sliceId: null,
        pullRequestNumber: null,
        artifactId: 'artifact-2',
      }),
    ).toThrow('sliceId');

    expect(() =>
      createDiscordThreadSession({
        id: 'thread-session-002b',
        summary: 'Implementation thread with pull request number',
        status: 'running',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'thread-2b',
        parentChannelId: 'channel-impl',
        threadId: 'thread-2b',
        kind: 'implementation',
        specId: 'spec-1',
        sliceId: 'slice-1',
        pullRequestNumber: 7,
        artifactId: 'artifact-2b',
      }),
    ).toThrow('Only pull request threads');
  });

  it('rejects spec threads that carry implementation slice identifiers', () => {
    expect(() =>
      createDiscordThreadSession({
        id: 'thread-session-003',
        summary: 'Spec thread with slice',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'thread-3',
        parentChannelId: 'channel-spec',
        threadId: 'thread-3',
        kind: 'spec',
        specId: 'spec-1',
        sliceId: 'slice-1',
        pullRequestNumber: null,
        artifactId: 'artifact-3',
      }),
    ).toThrow('implementation slices');
  });

  it('rejects spec threads that are missing a spec identifier', () => {
    expect(() =>
      createDiscordThreadSession({
        id: 'thread-session-003b',
        summary: 'Spec thread without spec id',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'thread-3b',
        parentChannelId: 'channel-spec',
        threadId: 'thread-3b',
        kind: 'spec',
        specId: null,
        sliceId: null,
        pullRequestNumber: null,
        artifactId: 'artifact-3b',
      }),
    ).toThrow('specId');
  });

  it('accepts implementation threads and rejects empty identifiers', () => {
    const session = createDiscordThreadSession({
      id: 'thread-session-004',
      summary: 'Implementation thread',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-4',
      parentChannelId: 'channel-impl',
      threadId: 'thread-4',
      kind: 'implementation',
      specId: 'spec-1',
      sliceId: 'slice-1',
      pullRequestNumber: null,
      artifactId: 'artifact-4',
    });

    expect(session.trace).toContain('discord:thread:implementation:thread-4');
    expect(() =>
      createDiscordThreadSession({
        ...session,
        id: 'thread-session-005',
        guildId: ' ',
      }),
    ).toThrow('guildId');
  });

  it('accepts pull request threads and requires a pull request number', () => {
    const session = createDiscordThreadSession({
      id: 'thread-session-006',
      summary: 'Pull request thread',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'thread-6',
      parentChannelId: 'channel-pr',
      threadId: 'thread-6',
      kind: 'pull-request',
      specId: null,
      sliceId: null,
      pullRequestNumber: 12,
      artifactId: 'artifact-6',
    });

    expect(session.trace).toContain('discord:thread:pull-request:thread-6');
    expect(() =>
      createDiscordThreadSession({
        ...session,
        id: 'thread-session-007',
        pullRequestNumber: null,
      }),
    ).toThrow('pullRequestNumber');
    expect(() =>
      createDiscordThreadSession({
        ...session,
        id: 'thread-session-008',
        kind: 'spec',
        specId: 'spec-6',
        pullRequestNumber: 12,
      }),
    ).toThrow('Only pull request threads');
  });

  it('rejects pull request threads with non-positive or non-integer numbers', () => {
    const invalidNumbers = [0, -1, 1.5];

    invalidNumbers.forEach((pullRequestNumber, index) => {
      expect(() =>
        createDiscordThreadSession({
          id: `thread-session-invalid-pr-${index + 1}`,
          summary: 'Pull request thread',
          status: 'review',
          trace: [],
          updatedAt: '2026-04-04T00:00:00.000Z',
          guildId: 'guild-1',
          channelId: 'thread-invalid-pr',
          parentChannelId: 'channel-pr',
          threadId: 'thread-invalid-pr',
          kind: 'pull-request',
          specId: null,
          sliceId: null,
          pullRequestNumber,
          artifactId: `artifact-invalid-pr-${index + 1}`,
        }),
      ).toThrow('positive integer');
    });
  });
});
