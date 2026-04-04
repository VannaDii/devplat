import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';
import { FileStoreService } from '@vannadii/devplat-storage';

import {
  createDiscordControlRequest,
  describeDiscordControlRequest,
} from './logic.js';
import type { DiscordControlRequest, DiscordControlResult } from './types.js';

export class DiscordControlPlaneService {
  public constructor(
    private readonly policy = new DecisionPolicyService(),
    private readonly telemetry = new TelemetryEventService(),
    private readonly store = new FileStoreService(),
  ) {}

  public execute(input: DiscordControlRequest): DiscordControlRequest {
    return createDiscordControlRequest(input);
  }

  public explain(input: DiscordControlRequest): string {
    return describeDiscordControlRequest(input);
  }

  public async handleAction(
    input: DiscordControlRequest,
  ): Promise<DiscordControlResult> {
    const request = this.execute(input);
    const decision = this.policy.evaluateControlAction(
      request.action,
      request.privileged,
    );

    await this.store.store({
      id: request.id,
      key: request.id,
      scope: 'state',
      summary: request.summary,
      status: decision.allowed ? 'approved' : 'review',
      trace: [...request.trace, ...decision.trace],
      updatedAt: request.updatedAt,
      payload: {
        threadId: request.threadId,
        channelId: request.channelId,
        action: request.action,
        policyDecisionId: decision.id,
      },
    });

    await this.telemetry.record({
      id: request.id,
      summary: request.summary,
      status: decision.allowed ? 'approved' : 'review',
      trace: request.trace,
      updatedAt: request.updatedAt,
      actorId: request.actorId,
      action: request.action,
      scope: 'discord',
      details: {
        threadId: request.threadId,
        channelId: request.channelId,
        policyDecisionId: decision.id,
        allowed: decision.allowed,
      },
    });

    return {
      request,
      policyDecisionId: decision.id,
      allowed: decision.allowed,
      persistedKey: request.id,
    };
  }
}
