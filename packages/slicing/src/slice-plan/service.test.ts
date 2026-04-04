import { describe, expect, it } from 'vitest';

import { SlicePlanService } from './service.js';

describe('SlicePlanService', () => {
  it('evaluates execution readiness for planned slices', () => {
    const service = new SlicePlanService();
    const snapshot = service.execute({
      sliceId: 'slice-001',
      specId: 'spec-001',
      title: 'Operator retry action',
      dependsOn: ['slice-000'],
      acceptanceCriteria: ['Expose retry button'],
      doneConditions: ['Tests pass'],
      size: 'small',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(service.readyForExecution(snapshot, ['slice-000'])).toBe(true);
    expect(service.explain(snapshot)).toContain('Slice plan');
  });
});
