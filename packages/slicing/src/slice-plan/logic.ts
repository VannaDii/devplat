import type { SlicePlan } from './types.js';

export function createSlicePlan(input: SlicePlan): SlicePlan {
  return {
    ...input,
    title: input.title.trim(),
    dependsOn: [
      ...new Set(input.dependsOn.map((value) => value.trim()).filter(Boolean)),
    ],
    acceptanceCriteria: [
      ...new Set(
        input.acceptanceCriteria.map((value) => value.trim()).filter(Boolean),
      ),
    ],
    doneConditions: [
      ...new Set(
        input.doneConditions.map((value) => value.trim()).filter(Boolean),
      ),
    ],
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function isSliceReady(
  input: SlicePlan,
  completedSliceIds: readonly string[],
): boolean {
  return input.dependsOn.every((dependency) =>
    completedSliceIds.includes(dependency),
  );
}

export function describeSlicePlan(input: SlicePlan): string {
  return `Slice plan -> ${input.title}`;
}
