import { TelemetryEventService } from '@vannadii/devplat-observability';
import { DecisionPolicyService } from '@vannadii/devplat-policy';

import {
  createGitHubActionRequest,
  describeGitHubActionRequest,
  isPrivilegedGitHubAction,
} from './logic.js';
import type { GitHubActionDecision, GitHubActionRequest } from './types.js';

export class GitHubWorkflowService {
  public constructor(
    private readonly policy = new DecisionPolicyService(),
    private readonly telemetry = new TelemetryEventService(),
  ) {}

  public prepare(input: GitHubActionRequest): GitHubActionRequest {
    return createGitHubActionRequest(input);
  }

  public async submit(
    input: GitHubActionRequest,
    actorId = 'github-service',
  ): Promise<GitHubActionDecision> {
    const request = createGitHubActionRequest(input);
    const decision = this.policy.evaluateControlAction(
      request.action,
      isPrivilegedGitHubAction(request),
    );

    await this.telemetry.record({
      id: `telemetry:${request.action}:${String(Date.now())}`,
      summary: request.summary,
      status: decision.allowed ? 'approved' : 'blocked',
      trace: ['github:workflow'],
      updatedAt: request.updatedAt,
      actorId,
      action: `github:${request.action}`,
      scope: 'github',
      details: {
        repoFullName: request.repoFullName,
        targetNumber: request.targetNumber ?? null,
        branchName: request.branchName ?? null,
      },
    });

    return {
      request,
      allowed: decision.allowed,
      policyDecisionId: decision.id,
    };
  }

  public explain(input: GitHubActionRequest): string {
    return describeGitHubActionRequest(input);
  }
}
