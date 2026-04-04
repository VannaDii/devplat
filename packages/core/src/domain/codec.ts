import * as t from 'io-ts';

import type { DomainSnapshot, Exact } from './types.js';

export const LifecycleStatusCodec = t.union([
  t.literal('draft'),
  t.literal('queued'),
  t.literal('claimed'),
  t.literal('running'),
  t.literal('review'),
  t.literal('blocked'),
  t.literal('approved'),
  t.literal('merge-ready'),
  t.literal('merged'),
  t.literal('failed'),
  t.literal('rebasing'),
  t.literal('complete'),
]);

export const DomainSnapshotCodec = t.type({
  id: t.string,
  summary: t.string,
  status: LifecycleStatusCodec,
  trace: t.array(t.string),
  updatedAt: t.string,
  domain: t.string,
});

export type _DomainSnapshotExact = Exact<
  DomainSnapshot,
  t.TypeOf<typeof DomainSnapshotCodec>
>;
