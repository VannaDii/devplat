import { describe, expect, it } from 'vitest';

import {
  createDiscordChannelBinding,
  createDiscordThreadBindingResult,
  describeDiscordChannelBinding,
} from './logic.js';

describe('Discord channel binding logic', () => {
  it('normalizes channel bindings and derives deterministic routing keys', () => {
    const binding = createDiscordChannelBinding({
      id: 'binding-001',
      summary: '  Spec channel binding  ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'channel-spec',
      kind: 'spec',
      threadBindingMode: 'inherit-parent',
    });

    const result = createDiscordThreadBindingResult(
      binding,
      'thread-1',
      'channel-spec',
    );

    expect(binding.trace).toContain('discord:binding:spec:channel-spec');
    expect(result.routingKey).toBe('guild-1:spec:thread-1');
    expect(describeDiscordChannelBinding(binding)).toBe(
      'spec:guild-1:channel-spec',
    );
  });

  it('rejects thread bindings that do not inherit from the configured channel', () => {
    const binding = createDiscordChannelBinding({
      id: 'binding-002',
      summary: 'Implementation channel binding',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'channel-impl',
      kind: 'implementation',
      threadBindingMode: 'inherit-parent',
    });

    expect(() =>
      createDiscordThreadBindingResult(binding, 'thread-2', 'channel-other'),
    ).toThrow('inherit');
  });

  it('rejects bindings with empty identifiers', () => {
    expect(() =>
      createDiscordChannelBinding({
        id: 'binding-003',
        summary: 'Broken binding',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: ' ',
        channelId: 'channel-audit',
        kind: 'audit',
        threadBindingMode: 'inherit-parent',
      }),
    ).toThrow('guildId');
  });

  it('supports pull request channel bindings for review-thread routing', () => {
    const binding = createDiscordChannelBinding({
      id: 'binding-004',
      summary: 'Pull request binding',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      guildId: 'guild-1',
      channelId: 'channel-pr',
      kind: 'pull-request',
      threadBindingMode: 'inherit-parent',
    });

    const result = createDiscordThreadBindingResult(
      binding,
      'thread-pr-1',
      'channel-pr',
    );

    expect(result.routingKey).toBe('guild-1:pull-request:thread-pr-1');
  });
});
