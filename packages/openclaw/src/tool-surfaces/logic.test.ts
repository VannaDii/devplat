import { describe, expect, it } from 'vitest';

import { createToolPayloadText } from './logic.js';

describe('tool surface logic', () => {
  it('serializes tool payloads as formatted JSON text', () => {
    expect(createToolPayloadText({ ok: true })).toContain('"ok": true');
  });
});
