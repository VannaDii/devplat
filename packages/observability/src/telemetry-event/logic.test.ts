import { describe, expect, it } from 'vitest';

import { createTelemetryEvent, describeTelemetryEvent } from './logic.js';

describe('TelemetryEvent logic', () => {
  it('normalizes the summary and appends a telemetry trace marker', () => {
    const event = createTelemetryEvent({
      id: 'telemetry-001',
      summary: '  operator approved slice  ',
      status: 'complete',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      actorId: 'user-123',
      action: 'approve-this',
      scope: 'discord',
      details: {
        threadId: 'thread-1',
      },
    });

    expect(event.summary).toBe('operator approved slice');
    expect(event.trace).toContain('telemetry:discord:approve-this');
    expect(describeTelemetryEvent(event)).toContain('discord:approve-this');
  });
});
