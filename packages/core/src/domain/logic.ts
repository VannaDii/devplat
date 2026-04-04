import type { DomainSnapshot, TraceRecord } from './types.js';

export function appendTrace<TRecord extends TraceRecord>(
  record: TRecord,
  marker: string,
): TRecord {
  return {
    ...record,
    summary: record.summary.trim(),
    trace: [...record.trace, marker],
    updatedAt: new Date(record.updatedAt).toISOString(),
  };
}

export function createDomainSnapshot(input: DomainSnapshot): DomainSnapshot {
  return appendTrace(input, `domain:${input.domain}`);
}

export function describeDomainSnapshot(input: DomainSnapshot): string {
  return `${input.domain} -> ${input.summary}`;
}
