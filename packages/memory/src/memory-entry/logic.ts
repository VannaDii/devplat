import type { MemoryEntry } from './types.js';

export function createMemoryEntry(input: MemoryEntry): MemoryEntry {
  const sourceArtifactId = input.sourceArtifactId?.trim();

  return {
    ...input,
    subject: input.subject.trim(),
    detail: input.detail.trim(),
    tags: [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))],
    updatedAt: new Date(input.updatedAt).toISOString(),
    ...(sourceArtifactId ? { sourceArtifactId } : {}),
  };
}

export function describeMemoryEntry(input: MemoryEntry): string {
  return `${input.kind} memory -> ${input.subject}`;
}
