import type { SpecRecord } from './types.js';

export function createSpecRecord(input: SpecRecord): SpecRecord {
  return {
    ...input,
    title: input.title.trim(),
    objective: input.objective.trim(),
    acceptanceCriteria: [
      ...new Set(
        input.acceptanceCriteria.map((value) => value.trim()).filter(Boolean),
      ),
    ],
    version: Math.max(1, Math.trunc(input.version)),
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function approveSpecRecord(input: SpecRecord): SpecRecord {
  const record = createSpecRecord(input);
  return {
    ...record,
    approvalState: 'approved',
  };
}

export function updateSpecRecord(input: SpecRecord): SpecRecord {
  const record = createSpecRecord(input);
  return {
    ...record,
    approvalState:
      record.approvalState === 'approved' ? 'review' : record.approvalState,
    version: record.version + 1,
  };
}

export function describeSpecRecord(input: SpecRecord): string {
  return `Spec record -> ${input.title}`;
}
