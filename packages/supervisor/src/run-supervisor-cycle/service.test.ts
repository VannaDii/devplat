import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';

import { SupervisorCycleService } from './service.js';

describe('SupervisorCycleService', () => {
  it('records supervisor decisions through observability', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-supervisor-'));
    const service = new SupervisorCycleService(
      new DecisionPolicyService(),
      new TelemetryEventService(new FileStoreService(rootDirectory)),
    );

    const decision = await service.runStep({
      action: 'retry-gates',
      actorId: 'operator-1',
      privileged: false,
    });

    expect(decision.approved).toBe(true);
  });

  it('covers execute, explain, and blocked run steps', async () => {
    const rootDirectory = await mkdtemp(join(tmpdir(), 'devplat-supervisor-'));
    const service = new SupervisorCycleService(
      new DecisionPolicyService(),
      new TelemetryEventService(new FileStoreService(rootDirectory)),
    );
    const executed = service.execute({
      id: 'supervisor-merge-now',
      summary: '  Supervisor handled merge-now  ',
      status: 'review',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      action: 'merge-now',
      nextState: 'review',
      approved: false,
      notes: ['requires approval'],
    });
    const decision = await service.runStep({
      action: 'merge-now',
      actorId: 'operator-2',
      privileged: true,
    });

    expect(service.explain(executed)).toContain('merge-now -> review');
    expect(decision.approved).toBe(false);
  });
});
