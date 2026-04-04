export function createToolPayloadText(payload: unknown): string {
  return JSON.stringify(payload, null, 2);
}
