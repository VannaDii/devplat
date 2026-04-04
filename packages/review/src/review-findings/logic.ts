import type { ReviewFinding } from './types.js';

export function createReviewFinding(input: ReviewFinding): ReviewFinding {
  return {
    ...input,
    path: input.path.trim(),
    message: input.message.trim(),
    rationale: input.rationale.trim(),
    fixRecommendation: input.fixRecommendation.trim(),
    blocking:
      input.blocking ||
      input.severity === 'high' ||
      input.severity === 'critical',
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function isBlockingReviewFinding(input: ReviewFinding): boolean {
  return input.blocking;
}

export function describeReviewFinding(input: ReviewFinding): string {
  return `${input.severity} finding -> ${input.path}`;
}
