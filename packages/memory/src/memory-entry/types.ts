export type MemoryKind = 'decision' | 'constraint' | 'preference' | 'trap';

export type MemoryStatus = 'active' | 'superseded';

export interface MemoryEntry {
  memoryId: string;
  kind: MemoryKind;
  subject: string;
  detail: string;
  tags: string[];
  status: MemoryStatus;
  sourceArtifactId?: string;
  updatedAt: string;
}
