import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface PolicyDecision {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  action: string;
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
}
