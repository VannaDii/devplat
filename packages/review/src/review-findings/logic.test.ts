import { describe, expect, it } from 'vitest';

import {
  createReviewFinding,
  describeReviewFinding,
  isBlockingReviewFinding,
} from './logic.js';

describe('ReviewFinding logic', () => {
  it('elevates high-severity findings to blocking', () => {
    const snapshot = createReviewFinding({
      findingId: 'finding-001',
      severity: 'high',
      path: 'packages/openclaw/src/index.ts',
      message: '  Transport validation is too weak.  ',
      rationale: '  Invalid inputs would reach the adapter.  ',
      fixRecommendation: '  Decode inputs with io-ts before dispatch.  ',
      blocking: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.blocking).toBe(true);
    expect(isBlockingReviewFinding(snapshot)).toBe(true);
    expect(describeReviewFinding(snapshot)).toContain('high finding');
  });

  it('keeps low-severity findings non-blocking when explicitly safe', () => {
    const snapshot = createReviewFinding({
      findingId: 'finding-002',
      severity: 'low',
      path: 'packages/core/src/domain/logic.ts',
      message: '  Minor docs gap  ',
      rationale: '  This does not change behavior.  ',
      fixRecommendation: '  Clarify the summary string.  ',
      blocking: false,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(isBlockingReviewFinding(snapshot)).toBe(false);
  });
});
