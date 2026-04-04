import type { LifecycleStatus } from '@vannadii/devplat-core';

export interface TelemetryEvent {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  actorId: string;
  action: string;
  scope: 'discord' | 'github' | 'supervisor' | 'storage';
  details: Record<string, unknown>;
}
