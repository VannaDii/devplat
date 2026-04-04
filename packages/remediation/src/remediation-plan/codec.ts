import * as t from 'io-ts';

import type { RemediationPlan } from './types.js';

export const RemediationPlanCodec = t.type({
  planId: t.string,
  findingIds: t.array(t.string),
  actions: t.array(t.string),
  autofix: t.boolean,
  approvalRequired: t.boolean,
  updatedAt: t.string,
});

export type _RemediationPlanExact =
  t.TypeOf<typeof RemediationPlanCodec> extends RemediationPlan
    ? RemediationPlan extends t.TypeOf<typeof RemediationPlanCodec>
      ? true
      : never
    : never;
