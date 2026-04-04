import * as t from 'io-ts';

import type { RebasePlan } from './types.js';

export const RebasePlanCodec = t.type({
  mergedPrNumber: t.number,
  baseBranch: t.string,
  dependentBranches: t.array(t.string),
  rebaseRequired: t.boolean,
  conflictsExpected: t.boolean,
  updatedAt: t.string,
});

export type _RebasePlanExact =
  t.TypeOf<typeof RebasePlanCodec> extends RebasePlan
    ? RebasePlan extends t.TypeOf<typeof RebasePlanCodec>
      ? true
      : never
    : never;
