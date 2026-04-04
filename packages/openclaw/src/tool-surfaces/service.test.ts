import { describe, expect, it } from 'vitest';

import {
  createAllocateWorktreeTool,
  createArtifactEnvelopeTool,
  createBindDiscordThreadTool,
  createClaimTaskTool,
  createExecuteCommandTool,
  createEvaluatePolicyActionTool,
  createEvaluateSonarQualityGateTool,
  createRemediationPlanTool,
  createRememberMemoryEntryTool,
  createRecordTelemetryEventTool,
  createReadStoredRecordTool,
  createReviewFindingTool,
  createHandleDiscordApprovalTool,
  createHandleDiscordControlTool,
  createListStoredRecordsTool,
  createOpenDiscordThreadTool,
  createResolveRuntimeConfigTool,
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
    const tool = createRunGatesTool({
      async run(gateNames, summary) {
        return {
          id: 'gate-run-report',
          summary,
          status: 'complete',
          trace: ['gates:passed'],
          updatedAt: '2026-04-04T00:00:00.000Z',
          passed: true,
          results: gateNames.map((gateName) => ({
            name: gateName,
            success: true,
            detail: `${gateName} -> exit 0`,
          })),
        };
      },
    });
    expect(tool.name).toBe('run_gates');
    const result = await tool.execute('tool-call-1', {
      gateNames: ['lint'],
      summary: 'run lint',
    });
    expect(result.details).toMatchObject({
      passed: true,
      results: [{ name: 'lint', success: true }],
    });
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

  it('resolves runtime config from valid tool input', async () => {
    const result = await createResolveRuntimeConfigTool().execute(
      'tool-call-cfg1',
      {
        env: {
          GITHUB_OWNER: 'VannaDii',
          GITHUB_REPO: 'devplat',
          DISCORD_DEFAULT_GUILD_ID: 'guild-1',
          DISCORD_SPEC_CHANNEL_ID: 'spec-1',
          DISCORD_IMPLEMENTATION_CHANNEL_ID: 'impl-1',
          DISCORD_AUDIT_CHANNEL_ID: 'audit-1',
          OPENCLAW_PLUGIN_ID: '@vannadii/devplat-openclaw',
          SONAR_ORGANIZATION: 'VannaDii',
          SONAR_PROJECT_KEY: 'VannaDii_devplat',
        },
      },
    );

    expect(result.details).toMatchObject({
      githubOwner: 'VannaDii',
      githubRepo: 'devplat',
      discord: {
        defaultGuildId: 'guild-1',
        specChannelId: 'spec-1',
      },
      sonar: {
        projectKey: 'VannaDii_devplat',
        minimumCoverage: 90,
      },
    });
  });

  it('returns decode failures for invalid runtime config input', async () => {
    const result = await createResolveRuntimeConfigTool().execute(
      'tool-call-cfg2',
      {
        env: {
          GITHUB_OWNER: 42,
        },
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('creates artifact envelopes from valid tool input', async () => {
    const result = await createArtifactEnvelopeTool().execute('tool-call-ae1', {
      id: 'artifact-generic-1',
      artifactType: 'audit-log',
      version: 1,
      summary: ' Generic audit artifact ',
      status: 'approved',
      trace: [],
      updatedAt: '2026-04-04T00:00:00.000Z',
      payload: {
        actorId: 'operator-1',
      },
    });

    expect(result.details).toMatchObject({
      id: 'artifact-generic-1',
      artifactType: 'audit-log',
      summary: 'Generic audit artifact',
      trace: ['artifact:audit-log'],
    });
  });

  it('returns decode failures for invalid artifact envelope input', async () => {
    const result = await createArtifactEnvelopeTool().execute('tool-call-ae2', {
      id: 'artifact-generic-1',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('executes commands from valid non-privileged tool input', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex1', {
      command: process.execPath,
      args: [
        '-e',
        'process.stdout.write(process.env.DEVPLAT_TEST_VALUE ?? "")',
      ],
      actorId: 'operator-1',
      privileged: false,
      env: {
        DEVPLAT_TEST_VALUE: 'ok',
      },
    });

    expect(result.details).toMatchObject({
      allowed: true,
      policyDecisionId: 'policy-execute-command',
      result: {
        exitCode: 0,
        stdout: 'ok',
      },
    });
  });

  it('blocks privileged command execution requests', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex2', {
      command: process.execPath,
      args: ['-e', 'process.stdout.write("blocked")'],
      actorId: 'operator-1',
      privileged: true,
    });

    expect(result.details).toMatchObject({
      allowed: false,
      policyDecisionId: 'policy-execute-command',
      request: {
        command: process.execPath,
      },
    });
  });

  it('rejects absolute cwd values for command execution', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex3', {
      command: process.execPath,
      args: ['-e', 'process.stdout.write("bad")'],
      actorId: 'operator-1',
      privileged: false,
      cwd: process.cwd(),
    });

    expect(result.details).toMatchObject({
      status: 'failed',
      error: 'cwd must be a relative repository path.',
    });
  });

  it('accepts blank cwd values for command execution', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex5', {
      command: process.execPath,
      args: ['-e', 'process.stdout.write("blank-cwd")'],
      actorId: 'operator-1',
      privileged: false,
      cwd: '   ',
    });

    expect(result.details).toMatchObject({
      allowed: true,
      request: {
        cwd: null,
        timeoutMs: null,
      },
      result: {
        exitCode: 0,
        stdout: 'blank-cwd',
        timedOut: false,
      },
    });
  });

  it('rejects cwd traversal outside the repository root', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex6', {
      command: process.execPath,
      args: ['-e', 'process.stdout.write("bad")'],
      actorId: 'operator-1',
      privileged: false,
      cwd: '../outside',
    });

    expect(result.details).toMatchObject({
      status: 'failed',
      error: 'cwd must stay within the repository root.',
    });
  });

  it('records failed command execution results when timeouts are exceeded', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex7', {
      command: process.execPath,
      args: ['-e', 'setTimeout(() => {}, 1_000)'],
      actorId: 'operator-1',
      privileged: false,
      cwd: 'packages',
      timeoutMs: 25,
    });

    expect(result.details).toMatchObject({
      allowed: true,
      request: {
        cwd: 'packages',
        timeoutMs: 25,
      },
      result: {
        exitCode: 124,
        timedOut: true,
      },
    });
  });

  it('returns decode failures for invalid command execution input', async () => {
    const result = await createExecuteCommandTool().execute('tool-call-ex4', {
      command: process.execPath,
      args: ['-e', 'process.stdout.write("bad")'],
      privileged: false,
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

  it('persists memory entries from valid tool input', async () => {
    const result = await createRememberMemoryEntryTool().execute(
      'tool-call-me1',
      {
        memoryId: 'memory-openclaw-1',
        kind: 'decision',
        subject: ' Use Discord as the primary control plane ',
        detail: ' Keep the operator flow auditable and thread-scoped. ',
        tags: ['discord', 'discord', ' audit '],
        status: 'active',
        sourceArtifactId: 'artifact-1',
        updatedAt: '2026-04-04T00:00:00.000Z',
      },
    );

    expect(result.details).toMatchObject({
      memoryId: 'memory-openclaw-1',
      subject: 'Use Discord as the primary control plane',
      tags: ['discord', 'audit'],
    });
  });

  it('returns decode failures for invalid memory entry input', async () => {
    const result = await createRememberMemoryEntryTool().execute(
      'tool-call-me2',
      {
        memoryId: 'memory-openclaw-1',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('evaluates policy actions from valid tool input', async () => {
    const result = await createEvaluatePolicyActionTool().execute(
      'tool-call-pa1',
      {
        action: 'merge-now',
        privileged: false,
      },
    );

    expect(result.details).toMatchObject({
      action: 'merge-now',
      allowed: false,
      requiresApproval: true,
    });
  });

  it('returns decode failures for invalid policy action input', async () => {
    const result = await createEvaluatePolicyActionTool().execute(
      'tool-call-pa2',
      {
        action: 'merge-now',
      },
    );

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('records telemetry events from valid tool input', async () => {
    const result = await createRecordTelemetryEventTool().execute(
      'tool-call-te1',
      {
        id: 'telemetry-openclaw-1',
        summary: ' Sync branch telemetry ',
        status: 'approved',
        trace: [],
        updatedAt: '2026-04-04T00:00:00.000Z',
        actorId: 'operator-1',
        action: 'sync-branch',
        scope: 'github',
        details: {
          prNumber: 42,
        },
      },
    );

    expect(result.details).toMatchObject({
      id: 'telemetry-openclaw-1',
      summary: 'Sync branch telemetry',
      trace: ['telemetry:github:sync-branch'],
    });
  });

  it('returns decode failures for invalid telemetry input', async () => {
    const result = await createRecordTelemetryEventTool().execute(
      'tool-call-te2',
      {
        id: 'telemetry-openclaw-1',
      },
    );

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

  it('reads stored records from valid tool input', async () => {
    await createRememberMemoryEntryTool().execute('tool-call-sr0', {
      memoryId: 'memory-openclaw-read-1',
      kind: 'constraint',
      subject: ' Preserve audit history ',
      detail: 'Stored reads should expose persisted records.',
      tags: ['audit'],
      status: 'active',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    const result = await createReadStoredRecordTool().execute('tool-call-sr1', {
      scope: 'memory',
      key: 'memory-openclaw-read-1',
    });

    expect(result.details).toMatchObject({
      status: 'ok',
      scope: 'memory',
      key: 'memory-openclaw-read-1',
      record: {
        id: 'memory-openclaw-read-1',
        scope: 'memory',
      },
    });
  });

  it('returns decode failures for invalid stored record reads', async () => {
    const result = await createReadStoredRecordTool().execute('tool-call-sr2', {
      scope: 'memory',
    });

    expect(result.details).toMatchObject({ status: 'failed' });
  });

  it('returns structured failures for missing stored record reads', async () => {
    const result = await createReadStoredRecordTool().execute('tool-call-sr3', {
      scope: 'memory',
      key: 'missing-memory-key',
    });

    expect(result.details).toMatchObject({
      status: 'failed',
      scope: 'memory',
      key: 'missing-memory-key',
    });
  });

  it('lists stored records from valid tool input', async () => {
    await createRememberMemoryEntryTool().execute('tool-call-ls0', {
      memoryId: 'memory-openclaw-list-1',
      kind: 'preference',
      subject: ' Prefer auditable controls ',
      detail: 'List calls should expose known persisted keys.',
      tags: ['controls'],
      status: 'active',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    const result = await createListStoredRecordsTool().execute(
      'tool-call-ls1',
      {
        scope: 'memory',
      },
    );

    expect(result.details).toEqual(
      expect.objectContaining({
        status: 'ok',
        scope: 'memory',
        keys: expect.arrayContaining(['memory-openclaw-list-1']),
      }),
    );
  });

  it('returns decode failures for invalid stored record listing', async () => {
    const result = await createListStoredRecordsTool().execute(
      'tool-call-ls2',
      {},
    );

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
