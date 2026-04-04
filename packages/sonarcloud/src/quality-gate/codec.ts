import * as t from 'io-ts';

import type { SonarQualityGateResult } from './types.js';

export const SonarQualityGateResultCodec = t.type({
  projectKey: t.string,
  status: t.union([t.literal('passed'), t.literal('failed')]),
  overallCoverage: t.number,
  newCodeCoverage: t.number,
  blockingIssues: t.number,
  evaluatedAt: t.string,
});

export type _SonarQualityGateResultExact =
  t.TypeOf<typeof SonarQualityGateResultCodec> extends SonarQualityGateResult
    ? SonarQualityGateResult extends t.TypeOf<
        typeof SonarQualityGateResultCodec
      >
      ? true
      : never
    : never;
