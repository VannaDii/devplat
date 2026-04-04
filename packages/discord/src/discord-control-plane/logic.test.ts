import { describe, expect, it } from 'vitest';

import {
  createDiscordControlRequest,
  describeDiscordControlRequest,
} from './logic.js';

describe('DiscordControlRequest logic', () => {
  it('keeps actions thread-scoped and auditable', () => {
    const request = createDiscordControlRequest({
      id: 'discord-001',
      summary: '  approve this slice  ',
      status: 'running',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-1',
      threadId: 'thread-1',
      channelId: 'channel-1',
      action: 'approve-this',
      privileged: true,
    });

    expect(request.summary).toBe('approve this slice');
    expect(request.trace).toContain('discord:thread-1:approve-this');
    expect(describeDiscordControlRequest(request)).toContain(
      'thread-1:approve-this',
    );
  });

  it('rejects control actions that are not scoped to a thread', () => {
    expect(() =>
      createDiscordControlRequest({
        id: 'discord-002',
        summary: 'missing thread',
        status: 'running',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        actorId: 'user-1',
        threadId: ' ',
        channelId: 'channel-1',
        action: 'pause-this',
        privileged: false,
      }),
    ).toThrow('thread');
  });
});
