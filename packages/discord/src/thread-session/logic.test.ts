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
        artifactId: 'artifact-2',
      }),
    ).toThrow('sliceId');
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
        artifactId: 'artifact-3',
      }),
    ).toThrow('implementation slices');
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
});
