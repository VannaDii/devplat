import { describe, expect, it } from 'vitest';

import {
  createAllocateWorktreeTool,
  createClaimTaskTool,
  createRunGatesTool,
  createRunSupervisorStepTool,
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
