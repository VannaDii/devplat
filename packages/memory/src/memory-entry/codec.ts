import * as t from 'io-ts';

import type { MemoryEntry } from './types.js';

export const MemoryEntryCodec = t.intersection([
  t.type({
    memoryId: t.string,
    kind: t.union([
      t.literal('decision'),
      t.literal('constraint'),
      t.literal('preference'),
      t.literal('trap'),
    ]),
    subject: t.string,
    detail: t.string,
    tags: t.array(t.string),
    status: t.union([t.literal('active'), t.literal('superseded')]),
    updatedAt: t.string,
  }),
  t.partial({
    sourceArtifactId: t.string,
  }),
]);

export type _MemoryEntryExact =
  t.TypeOf<typeof MemoryEntryCodec> extends MemoryEntry
    ? MemoryEntry extends t.TypeOf<typeof MemoryEntryCodec>
      ? true
      : never
    : never;
