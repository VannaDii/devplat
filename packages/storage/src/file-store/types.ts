import type { LifecycleStatus } from '@vannadii/devplat-core';

export type StoreScope = 'artifacts' | 'memory' | 'state' | 'telemetry';

export interface StoredRecord<
  TPayload extends object = Record<string, unknown>,
> {
  id: string;
  key: string;
  scope: StoreScope;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  payload: TPayload;
}

export type StoredRecordSchema = StoredRecord;
