const REDACTED_VALUE = '[redacted]';

function isSensitiveKey(key: string): boolean {
  const normalized = key.replace(/[^a-z0-9]/gi, '').toLowerCase();

  return (
    normalized === 'publickey' ||
    normalized === 'privatekey' ||
    normalized.endsWith('token') ||
    normalized.endsWith('secret') ||
    normalized.endsWith('password') ||
    normalized.endsWith('apikey')
  );
}

export function sanitizeToolPayloadForDisplay(payload: unknown): unknown {
  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeToolPayloadForDisplay(item));
  }

  if (typeof payload !== 'object' || payload === null) {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      isSensitiveKey(key)
        ? REDACTED_VALUE
        : sanitizeToolPayloadForDisplay(value),
    ]),
  );
}

export function formatToolPayloadText(payload: unknown): string {
  return JSON.stringify(payload, null, 2);
}

export function createToolPayloadText(payload: unknown): string {
  return formatToolPayloadText(sanitizeToolPayloadForDisplay(payload));
}
