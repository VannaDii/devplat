import { appendTrace } from '@vannadii/devplat-core';

import type { TelemetryEvent } from './types.js';

export function createTelemetryEvent(input: TelemetryEvent): TelemetryEvent {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `telemetry:${input.scope}:${input.action}`,
  );
}

export function describeTelemetryEvent(input: TelemetryEvent): string {
  return `${input.scope}:${input.action} -> ${input.summary}`;
}
