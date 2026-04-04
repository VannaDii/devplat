import * as t from 'io-ts';

import type {
  SonarBootstrapVerificationInput,
  SonarBootstrapVerificationResult,
} from './types.js';

export const SonarQualityGateConditionSnapshotCodec = t.type({
  metricKey: t.string,
  comparator: t.string,
  errorThreshold: t.string,
  actualValue: t.union([t.string, t.null]),
});

export const SonarBootstrapVerificationInputCodec = t.type({
  projectKey: t.string,
  qualityGateStatus: t.union([
    t.literal('ERROR'),
    t.literal('NONE'),
    t.literal('OK'),
  ]),
  conditions: t.array(SonarQualityGateConditionSnapshotCodec),
  evaluatedAt: t.string,
});

export const SonarBootstrapVerificationChecksCodec = t.type({
  qualityGateComputed: t.boolean,
  qualityGatePassing: t.boolean,
  overallCoverageCondition: t.boolean,
  newCodeCoverageCondition: t.boolean,
});

export const SonarBootstrapVerificationResultCodec = t.type({
  projectKey: t.string,
  status: t.union([t.literal('failed'), t.literal('passed')]),
  qualityGateStatus: t.union([
    t.literal('ERROR'),
    t.literal('NONE'),
    t.literal('OK'),
  ]),
  overallCoverageThreshold: t.number,
  newCodeCoverageThreshold: t.number,
  checks: SonarBootstrapVerificationChecksCodec,
  issues: t.array(t.string),
  evaluatedAt: t.string,
});

export type _SonarBootstrapVerificationInputExact =
  t.TypeOf<
    typeof SonarBootstrapVerificationInputCodec
  > extends SonarBootstrapVerificationInput
    ? SonarBootstrapVerificationInput extends t.TypeOf<
        typeof SonarBootstrapVerificationInputCodec
      >
      ? true
      : never
    : never;

export type _SonarBootstrapVerificationResultExact =
  t.TypeOf<
    typeof SonarBootstrapVerificationResultCodec
  > extends SonarBootstrapVerificationResult
    ? SonarBootstrapVerificationResult extends t.TypeOf<
        typeof SonarBootstrapVerificationResultCodec
      >
      ? true
      : never
    : never;
