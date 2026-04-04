import * as t from 'io-ts';

import type { ResearchBrief } from './types.js';

export const ResearchBriefCodec = t.type({
  researchId: t.string,
  topic: t.string,
  question: t.string,
  constraints: t.array(t.string),
  findings: t.array(t.string),
  recommendation: t.string,
  sourceUrls: t.array(t.string),
  updatedAt: t.string,
});

export type _ResearchBriefExact =
  t.TypeOf<typeof ResearchBriefCodec> extends ResearchBrief
    ? ResearchBrief extends t.TypeOf<typeof ResearchBriefCodec>
      ? true
      : never
    : never;
