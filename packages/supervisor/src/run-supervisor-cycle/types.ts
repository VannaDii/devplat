import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface SupervisorDecision {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  action: string;
  nextState: LifecycleStatus;
  approved: boolean;
  notes: string[];
}
