import { FileStoreService } from '@vannadii/devplat-storage';

import { createTelemetryEvent, describeTelemetryEvent } from './logic.js';
import type { TelemetryEvent } from './types.js';

export class TelemetryEventService {
  public constructor(private readonly store = new FileStoreService()) {}

  public async record(input: TelemetryEvent): Promise<TelemetryEvent> {
    const event = createTelemetryEvent(input);
    await this.store.store({
      id: event.id,
      key: event.id,
      scope: 'telemetry',
      summary: event.summary,
      status: event.status,
      trace: event.trace,
      updatedAt: event.updatedAt,
      payload: event,
    });
    return event;
  }

  public execute(input: TelemetryEvent): Promise<TelemetryEvent> {
    return this.record(input);
  }

  public explain(input: TelemetryEvent): string {
    return describeTelemetryEvent(input);
  }
}
