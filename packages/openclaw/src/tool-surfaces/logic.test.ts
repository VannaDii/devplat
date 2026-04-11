import { describe, expect, it } from 'vitest';

import {
  createToolPayloadText,
  sanitizeToolPayloadForDisplay,
} from './logic.js';

describe('tool surface logic', () => {
  const cases = [
    {
      name: 'serializes tool payloads as formatted JSON text',
      inputs: {
        payload: { ok: true },
      },
      mock: ({ payload }: { payload: unknown }) =>
        createToolPayloadText(payload),
      assert: (text: string) => {
        expect(text).toContain('"ok": true');
      },
    },
    {
      name: 'redacts sensitive fields recursively',
      inputs: {
        payload: {
          discord: {
            botToken: 'token-123',
            publicKey: 'public-key-123',
            nested: {
              refreshToken: 'refresh-token-123',
            },
          },
          projectKey: 'vannadii_devplat',
        },
      },
      mock: ({ payload }: { payload: unknown }) =>
        sanitizeToolPayloadForDisplay(payload),
      assert: (sanitizedPayload: unknown) => {
        expect(sanitizedPayload).toEqual({
          discord: {
            botToken: '[redacted]',
            publicKey: '[redacted]',
            nested: {
              refreshToken: '[redacted]',
            },
          },
          projectKey: 'vannadii_devplat',
        });
      },
    },
  ];

  it.each(cases)('$name', ({ inputs, mock, assert }) => {
    assert(mock(inputs));
  });
});
