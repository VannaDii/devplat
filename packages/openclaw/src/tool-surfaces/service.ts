import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { AnyAgentTool } from 'openclaw/plugin-sdk/plugin-entry';

import {
  ArtifactEnvelopeCodec,
  ArtifactEnvelopeService,
} from '@vannadii/devplat-artifacts';
import { decodeWithCodec } from '@vannadii/devplat-core';
import { RunGatesService } from '@vannadii/devplat-gates';
import { TaskQueueService } from '@vannadii/devplat-queue';
import { SupervisorCycleService } from '@vannadii/devplat-supervisor';
import { WorktreeAllocationService } from '@vannadii/devplat-worktrees';

import {
  AllocateWorktreeToolInputCodec,
  ClaimTaskToolInputCodec,
  RunGatesToolInputCodec,
  RunSupervisorStepToolInputCodec,
  UpdateTaskToolInputCodec,
  ValidateArtifactToolInputCodec,
} from './codec.js';
import { createToolPayloadText } from './logic.js';

function readSchema(fileName: string): Record<string, unknown> {
  const filePath = resolve(
    import.meta.dirname,
    '..',
    '..',
    'schemas',
    fileName,
  );
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Schema ${fileName} must contain a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

function createTextResult(payload: unknown): {
  content: Array<{ type: 'text'; text: string }>;
  details: unknown;
} {
  return {
    content: [
      {
        type: 'text',
        text: createToolPayloadText(payload),
      },
    ],
    details: payload,
  };
}

export function createRunGatesTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'run_gates',
    label: 'Run Gates',
    description: 'Run the configured DevPlat gate suite in scaffold mode.',
    parameters: readSchema('tool-run-gates-params.schema.json') as unknown,
    execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(RunGatesToolInputCodec, rawParams);
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const report = new RunGatesService().run(
        decoded.value.gateNames,
        decoded.value.summary,
      );
      return Promise.resolve(createTextResult(report));
    },
  };

  return tool;
}

export function createAllocateWorktreeTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'allocate_worktree',
    label: 'Allocate Worktree',
    description: 'Allocate a deterministic worktree path for a task branch.',
    parameters: readSchema(
      'tool-allocate-worktree-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(
        AllocateWorktreeToolInputCodec,
        rawParams,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const allocation = new WorktreeAllocationService().allocate(
        decoded.value.taskId,
        decoded.value.branchName,
      );
      return Promise.resolve(createTextResult(allocation));
    },
  };

  return tool;
}

export function createClaimTaskTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'claim_task',
    label: 'Claim Task',
    description: 'Claim a queued task for a specific assignee.',
    parameters: readSchema('tool-claim-task-params.schema.json') as unknown,
    execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(ClaimTaskToolInputCodec, rawParams);
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const claimed = new TaskQueueService().claim(
        {
          id: `task-${decoded.value.taskId}`,
          summary: `Task ${decoded.value.taskId}`,
          status: 'queued',
          trace: [],
          updatedAt: new Date().toISOString(),
          taskId: decoded.value.taskId,
          sliceId: decoded.value.sliceId,
          threadId: decoded.value.threadId,
        },
        decoded.value.assigneeId,
      );
      return Promise.resolve(createTextResult(claimed));
    },
  };

  return tool;
}

export function createUpdateTaskTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'update_task',
    label: 'Update Task',
    description: 'Update a task lifecycle state.',
    parameters: readSchema('tool-update-task-params.schema.json') as unknown,
    execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(UpdateTaskToolInputCodec, rawParams);
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const task = new TaskQueueService().updateStatus(
        {
          id: `task-${decoded.value.taskId}`,
          summary: `Task ${decoded.value.taskId}`,
          status: 'queued',
          trace: [],
          updatedAt: new Date().toISOString(),
          taskId: decoded.value.taskId,
          sliceId: decoded.value.sliceId,
          threadId: decoded.value.threadId,
        },
        decoded.value.status,
      );
      return Promise.resolve(createTextResult(task));
    },
  };

  return tool;
}

export function createValidateArtifactTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'validate_artifact',
    label: 'Validate Artifact',
    description:
      'Validate an artifact envelope against the shared artifact contract.',
    parameters: readSchema(
      'tool-validate-artifact-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(
        ValidateArtifactToolInputCodec,
        rawParams,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const artifact = decodeWithCodec(
        ArtifactEnvelopeCodec,
        decoded.value.artifact,
      );
      if (!artifact.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: artifact.error }),
        );
      }

      return Promise.resolve(
        createTextResult(new ArtifactEnvelopeService().execute(artifact.value)),
      );
    },
  };

  return tool;
}

export function createRunSupervisorStepTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'run_supervisor_step',
    label: 'Run Supervisor Step',
    description:
      'Run a single supervisor step with policy and telemetry recording.',
    parameters: readSchema(
      'tool-run-supervisor-step-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const rawParams: unknown = params;
      const decoded = decodeWithCodec(
        RunSupervisorStepToolInputCodec,
        rawParams,
      );
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const decision = await new SupervisorCycleService().runStep(
        decoded.value,
      );
      return createTextResult(decision);
    },
  };

  return tool;
}
