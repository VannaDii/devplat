import { appendTrace } from '@vannadii/devplat-core';

import type { StoredRecord, StoreScope } from './types.js';

export function createStoredRecord<TPayload extends object>(
  input: StoredRecord<TPayload>,
): StoredRecord<TPayload> {
  return appendTrace(
    {
      ...input,
      summary: input.summary.trim(),
      updatedAt: new Date(input.updatedAt).toISOString(),
    },
    `storage:${input.scope}`,
  );
}

export function buildStoragePath(scope: StoreScope, key: string): string {
  return `${scope}/${key}.json`;
}

export function describeStoredRecord<TPayload extends object>(
  input: StoredRecord<TPayload>,
): string {
  return `${buildStoragePath(input.scope, input.key)} -> ${input.summary}`;
}
