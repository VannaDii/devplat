import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface TaskRecord {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  taskId: string;
  sliceId: string;
  threadId: string;
  assigneeId?: string;
}
