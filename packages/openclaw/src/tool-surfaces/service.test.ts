import { describe, expect, it } from 'vitest';

import {
  createAllocateWorktreeTool,
  createBindDiscordThreadTool,
  createClaimTaskTool,
  createEvaluateSonarQualityGateTool,
  createRemediationPlanTool,
  createReviewFindingTool,
  createHandleDiscordApprovalTool,
  createHandleDiscordControlTool,
  createOpenDiscordThreadTool,
  createPlanRebaseDependentsTool,
  createResearchBriefTool,
  createRunGatesTool,
  createRunSupervisorStepTool,
  createSlicePlanTool,
  createSpecRecordTool,
  createSubmitGitHubActionTool,
  createSubmitPullRequestUpdateTool,
  createUpdateTaskTool,
  createValidateArtifactTool,
} from './service.js';

describe('tool surface service', () => {
  it('creates OpenClaw-compatible tool definitions', async () => {
    const tool = createRunGatesTool();
    expect(tool.name).toBe('run_gates');
    const result = await tool.execute('tool-call-1', {
      gateNames: ['lint'],
      summary: 'run lint',
    });
    expect(result.details).toBeTruthy();
  });

  it('creates research brief artifacts from valid tool input', async () => {
    const result = await createResearchBriefTool().execute('tool-call-r1', {
      researchId: 'research-1',
      topic: ' Discord-first workflows ',
      question: 'What should Phase 0 expose?',
      constraints: ['auditability', 'auditability'],
      findings: ['thread isolation'],
      recommendation: 'Expose thread-aware tools.',
      sourceUrls: ['https://example.com/openclaw'],
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.details).toMatchObject({
      artifactType: 'research-brief',
      payload: { topic: 'Discord-first workflows' },
    });
  });

  it('returns decode failures for invalid research brief input', async () => {
    const result = await createResearchBriefTool().execute('tool-call-r2', {
      researchId: 'research-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('creates spec record artifacts from valid tool input', async () => {
    const result = await createSpecRecordTool().execute('tool-call-s1', {
      specId: 'spec-1',
      researchId: 'research-1',
      title: ' Discord approval flow ',
      objective: 'Add explicit approval routing.',
      acceptanceCriteria: ['policy check', 'audit artifact'],
      approvalState: 'review',
      version: 1,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.details).toMatchObject({
      artifactType: 'spec-record',
      payload: { title: 'Discord approval flow' },
    });
  });

  it('returns decode failures for invalid spec record input', async () => {
    const result = await createSpecRecordTool().execute('tool-call-s2', {
      specId: 'spec-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('creates slice plans from valid tool input', async () => {
    const result = await createSlicePlanTool().execute('tool-call-sl1', {
      sliceId: 'slice-1',
      specId: 'spec-1',
      title: ' Wire Discord controls ',
      dependsOn: ['slice-0'],
      acceptanceCriteria: ['control persisted'],
      doneConditions: ['tests pass'],
      size: 'small',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.details).toMatchObject({
      sliceId: 'slice-1',
      title: 'Wire Discord controls',
    });
  });

  it('returns decode failures for invalid slice plan input', async () => {
    const result = await createSlicePlanTool().execute('tool-call-sl2', {
      sliceId: 'slice-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('returns decode failures for invalid run_gates input', async () => {
    const result = await createRunGatesTool().execute('tool-call-2', {
      gateNames: 'lint',
      summary: 'run lint',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('allocates worktrees from valid tool input', async () => {
    const result = await createAllocateWorktreeTool().execute('tool-call-3', {
      taskId: 'task-1',
      branchName: 'feature/task-1',
    });

    expect(result.details).toMatchObject({ taskId: 'task-1' });
  });

  it('binds Discord threads from valid tool input', async () => {
    const result = await createBindDiscordThreadTool().execute(
      'tool-call-db1',
      {
        id: 'binding-1',
        summary: 'Bind spec thread',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'channel-1',
        kind: 'spec',
        threadBindingMode: 'inherit-parent',
        threadId: 'thread-1',
        parentChannelId: 'channel-1',
        actorId: 'operator-1',
      },
    );

    expect(result.details).toMatchObject({
      threadId: 'thread-1',
      routingKey: 'guild-1:spec:thread-1',
    });
  });

  it('returns decode failures for invalid Discord binding input', async () => {
    const result = await createBindDiscordThreadTool().execute(
      'tool-call-db2',
      {
        id: 'binding-1',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('opens Discord thread sessions from valid tool input', async () => {
    const result = await createOpenDiscordThreadTool().execute(
      'tool-call-dt1',
      {
        id: 'session-1',
        summary: 'Spec thread',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        guildId: 'guild-1',
        channelId: 'channel-1',
        parentChannelId: 'parent-1',
        threadId: 'thread-1',
        kind: 'spec',
        specId: 'spec-1',
        sliceId: null,
        artifactId: 'artifact-1',
        actorId: 'operator-1',
      },
    );

    expect(result.details).toMatchObject({
      artifactId: 'artifact-1',
      persistedKey: 'session-1',
    });
  });

  it('returns decode failures for invalid Discord thread input', async () => {
    const result = await createOpenDiscordThreadTool().execute(
      'tool-call-dt2',
      {
        id: 'session-1',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('returns decode failures for invalid worktree input', async () => {
    const result = await createAllocateWorktreeTool().execute('tool-call-4', {
      taskId: 'task-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('claims queued tasks from valid tool input', async () => {
    const result = await createClaimTaskTool().execute('tool-call-5', {
      taskId: 'task-1',
      sliceId: 'slice-1',
      threadId: 'thread-1',
      assigneeId: 'worker-1',
    });

    expect(result.details).toMatchObject({
      status: 'claimed',
      assigneeId: 'worker-1',
    });
  });

  it('returns decode failures for invalid claim input', async () => {
    const result = await createClaimTaskTool().execute('tool-call-6', {
      taskId: 'task-1',
      sliceId: 'slice-1',
      threadId: 'thread-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('handles Discord approvals from valid tool input', async () => {
    const result = await createHandleDiscordApprovalTool().execute(
      'tool-call-da1',
      {
        id: 'approval-1',
        summary: 'Approve this',
        status: 'review',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        actorId: 'operator-1',
        channelId: 'channel-1',
        threadId: 'thread-1',
        action: 'approve',
        artifactId: 'artifact-1',
        privileged: true,
      },
    );

    expect(result.details).toMatchObject({
      allowed: false,
      policyDecisionId: 'policy-approve-this',
    });
  });

  it('returns decode failures for invalid Discord approval input', async () => {
    const result = await createHandleDiscordApprovalTool().execute(
      'tool-call-da2',
      {
        id: 'approval-1',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('handles Discord control actions from valid tool input', async () => {
    const result = await createHandleDiscordControlTool().execute(
      'tool-call-dc1',
      {
        id: 'control-1',
        summary: 'Retry gates',
        status: 'review',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        actorId: 'operator-1',
        threadId: 'thread-1',
        channelId: 'channel-1',
        action: 'retry-gates',
        privileged: false,
      },
    );

    expect(result.details).toMatchObject({
      allowed: true,
      policyDecisionId: 'policy-retry-gates',
    });
  });

  it('returns decode failures for invalid Discord control input', async () => {
    const result = await createHandleDiscordControlTool().execute(
      'tool-call-dc2',
      {
        id: 'control-1',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('evaluates Sonar quality gates from valid tool input', async () => {
    const result = await createEvaluateSonarQualityGateTool().execute(
      'tool-call-sq1',
      {
        projectKey: 'VannaDii_devplat',
        overallCoverage: 91,
        newCodeCoverage: 92,
        blockingIssues: 0,
      },
    );

    expect(result.details).toMatchObject({
      projectKey: 'VannaDii_devplat',
      status: 'passed',
    });
  });

  it('returns decode failures for invalid Sonar quality gate input', async () => {
    const result = await createEvaluateSonarQualityGateTool().execute(
      'tool-call-sq2',
      {
        projectKey: 'VannaDii_devplat',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('creates review finding artifacts from valid tool input', async () => {
    const result = await createReviewFindingTool().execute('tool-call-rf1', {
      findingId: 'finding-1',
      severity: 'high',
      path: 'packages/openclaw/src/tool-surfaces/service.ts',
      message: 'Missing policy mediation.',
      rationale: 'Privileged actions must stay policy-aware.',
      fixRecommendation: 'Delegate through the policy service.',
      blocking: true,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(result.details).toMatchObject({
      artifactType: 'review-finding',
      payload: { findingId: 'finding-1' },
    });
  });

  it('returns decode failures for invalid review finding input', async () => {
    const result = await createReviewFindingTool().execute('tool-call-rf2', {
      findingId: 'finding-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('creates remediation plans from valid tool input', async () => {
    const result = await createRemediationPlanTool().execute('tool-call-rp1', {
      findings: [
        {
          findingId: 'finding-1',
          severity: 'medium',
          path: 'packages/openclaw/src/tool-surfaces/service.ts',
          message: 'Add test coverage.',
          rationale: 'The adapter needs direct surface tests.',
          fixRecommendation: 'Add a focused service test.',
          blocking: false,
          updatedAt: '2026-04-04T00:00:00.000Z',
        },
      ],
      autofix: true,
    });

    expect(result.details).toMatchObject({
      findingIds: ['finding-1'],
      autofix: true,
    });
  });

  it('returns decode failures for invalid remediation input', async () => {
    const result = await createRemediationPlanTool().execute('tool-call-rp2', {
      findings: {},
      autofix: true,
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('updates task lifecycle state from valid tool input', async () => {
    const result = await createUpdateTaskTool().execute('tool-call-7', {
      taskId: 'task-1',
      sliceId: 'slice-1',
      threadId: 'thread-1',
      status: 'merged',
    });

    expect(result.details).toMatchObject({ status: 'merged' });
  });

  it('returns decode failures for invalid update input', async () => {
    const result = await createUpdateTaskTool().execute('tool-call-8', {
      taskId: 'task-1',
      sliceId: 'slice-1',
      threadId: 'thread-1',
      status: 'queued',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('submits pull request updates from valid tool input', async () => {
    const result = await createSubmitPullRequestUpdateTool().execute(
      'tool-call-pr1',
      {
        record: {
          prNumber: 42,
          branchName: 'feature/discord-tools',
          baseBranch: 'main',
          title: 'Expand OpenClaw tools',
          labels: ['automation'],
          reviewState: 'approved',
          mergeReady: true,
          updatedAt: '2026-04-04T00:00:00.000Z',
        },
        actorId: 'operator-1',
      },
    );

    expect(result.details).toMatchObject({
      allowed: false,
      request: { action: 'update-pr' },
    });
  });

  it('returns decode failures for invalid pull request update input', async () => {
    const result = await createSubmitPullRequestUpdateTool().execute(
      'tool-call-pr2',
      {
        record: {
          prNumber: 42,
        },
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('plans dependent rebases from valid tool input', async () => {
    const result = await createPlanRebaseDependentsTool().execute(
      'tool-call-rb1',
      {
        record: {
          prNumber: 42,
          branchName: 'feature/discord-tools',
          baseBranch: 'main',
          title: 'Expand OpenClaw tools',
          labels: ['automation'],
          reviewState: 'approved',
          mergeReady: true,
          updatedAt: '2026-04-04T00:00:00.000Z',
        },
        dependentBranches: ['feature/downstream'],
      },
    );

    expect(result.details).toMatchObject({
      mergedPrNumber: 42,
      rebaseRequired: true,
    });
  });

  it('returns decode failures for invalid rebase plan input', async () => {
    const result = await createPlanRebaseDependentsTool().execute(
      'tool-call-rb2',
      {
        record: {
          prNumber: 42,
        },
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('submits GitHub actions from valid tool input', async () => {
    const result = await createSubmitGitHubActionTool().execute(
      'tool-call-gh1',
      {
        request: {
          repoFullName: 'VannaDii/devplat',
          action: 'sync-branch',
          summary: 'Sync downstream branch',
          privileged: false,
          branchName: 'feature/downstream',
          updatedAt: '2026-04-04T00:00:00.000Z',
        },
        actorId: 'operator-1',
      },
    );

    expect(result.details).toMatchObject({
      allowed: true,
      request: { action: 'sync-branch' },
    });
  });

  it('returns decode failures for invalid GitHub action input', async () => {
    const result = await createSubmitGitHubActionTool().execute(
      'tool-call-gh2',
      {
        request: {
          repoFullName: 'VannaDii/devplat',
        },
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('rejects missing artifact payloads', async () => {
    const result = await createValidateArtifactTool().execute(
      'tool-call-9',
      {},
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('rejects invalid artifact envelopes', async () => {
    const result = await createValidateArtifactTool().execute('tool-call-10', {
      artifact: {},
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('validates well-formed artifact envelopes', async () => {
    const result = await createValidateArtifactTool().execute('tool-call-11', {
      artifact: {
        id: 'artifact-1',
        artifactType: 'review-finding',
        version: 1,
        summary: 'artifact',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        payload: {
          findingId: 'finding-1',
        },
      },
    });

    expect(result.details).toMatchObject({ artifactType: 'review-finding' });
  });

  it('runs supervisor steps from valid tool input', async () => {
    const result = await createRunSupervisorStepTool().execute('tool-call-12', {
      action: 'retry-gates',
      actorId: 'operator-1',
      privileged: false,
    });

    expect(result.details).toMatchObject({
      approved: true,
      nextState: 'approved',
    });
  });

  it('returns decode failures for invalid supervisor input', async () => {
    const result = await createRunSupervisorStepTool().execute('tool-call-13', {
      action: 'retry-gates',
      actorId: 'operator-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });
});
