import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface GateCheckResult {
  name: string;
  success: boolean;
  detail: string;
}

export interface GateRunReport {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  passed: boolean;
  results: GateCheckResult[];
}
