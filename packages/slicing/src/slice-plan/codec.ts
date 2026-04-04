import * as t from 'io-ts';

import type { SlicePlan } from './types.js';

export const SlicePlanCodec = t.type({
  sliceId: t.string,
  specId: t.string,
  title: t.string,
  dependsOn: t.array(t.string),
  acceptanceCriteria: t.array(t.string),
  doneConditions: t.array(t.string),
  size: t.union([t.literal('small'), t.literal('medium'), t.literal('large')]),
  updatedAt: t.string,
});

export type _SlicePlanExact =
  t.TypeOf<typeof SlicePlanCodec> extends SlicePlan
    ? SlicePlan extends t.TypeOf<typeof SlicePlanCodec>
      ? true
      : never
    : never;
