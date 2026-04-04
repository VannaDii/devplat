import * as t from 'io-ts';

import type { ReviewFinding } from './types.js';

export const ReviewFindingCodec = t.type({
  findingId: t.string,
  severity: t.union([
    t.literal('low'),
    t.literal('medium'),
    t.literal('high'),
    t.literal('critical'),
  ]),
  path: t.string,
  message: t.string,
  rationale: t.string,
  fixRecommendation: t.string,
  blocking: t.boolean,
  updatedAt: t.string,
});

export type _ReviewFindingExact =
  t.TypeOf<typeof ReviewFindingCodec> extends ReviewFinding
    ? ReviewFinding extends t.TypeOf<typeof ReviewFindingCodec>
      ? true
      : never
    : never;
