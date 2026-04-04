import { describe, expect, it } from 'vitest';

import { createSlicePlan, describeSlicePlan, isSliceReady } from './logic.js';

describe('SlicePlan logic', () => {
  it('normalizes dependency-aware slice plans', () => {
    const snapshot = createSlicePlan({
      sliceId: 'slice-001',
      specId: 'spec-001',
      title: '  Add operator retry action  ',
      dependsOn: ['slice-000', 'slice-000'],
      acceptanceCriteria: ['Retry gates command', 'Retry gates command'],
      doneConditions: ['Tests added', 'Docs updated'],
      size: 'small',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.dependsOn).toEqual(['slice-000']);
    expect(snapshot.acceptanceCriteria).toEqual(['Retry gates command']);
    expect(isSliceReady(snapshot, ['slice-000'])).toBe(true);
    expect(describeSlicePlan(snapshot)).toContain('Slice plan');
  });
});
