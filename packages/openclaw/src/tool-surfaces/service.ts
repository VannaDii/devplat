import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { AnyAgentTool } from 'openclaw/plugin-sdk/plugin-entry';

import { RebaseDependentsService } from '@vannadii/devplat-branching';
import {
  ArtifactEnvelopeCodec,
  ArtifactEnvelopeService,
} from '@vannadii/devplat-artifacts';
import { decodeWithCodec } from '@vannadii/devplat-core';
import {
  DiscordChannelBindingService,
  DiscordControlPlaneService,
  DiscordInteractiveApprovalService,
  DiscordThreadSessionService,
} from '@vannadii/devplat-discord';
import { RunGatesService } from '@vannadii/devplat-gates';
import { GitHubWorkflowService } from '@vannadii/devplat-github';
import { PullRequestService } from '@vannadii/devplat-prs';
import { TaskQueueService } from '@vannadii/devplat-queue';
import { ResearchBriefService } from '@vannadii/devplat-research';
import { RemediationPlanService } from '@vannadii/devplat-remediation';
import { ReviewFindingsService } from '@vannadii/devplat-review';
import { SlicePlanService } from '@vannadii/devplat-slicing';
import { SonarQualityGateService } from '@vannadii/devplat-sonarcloud';
import { SpecRecordService } from '@vannadii/devplat-specs';
import { SupervisorCycleService } from '@vannadii/devplat-supervisor';
import { WorktreeAllocationService } from '@vannadii/devplat-worktrees';

import {
  AllocateWorktreeToolInputCodec,
  BindDiscordThreadToolInputCodec,
  ClaimTaskToolInputCodec,
  CreateRemediationPlanToolInputCodec,
  CreateResearchBriefToolInputCodec,
  CreateReviewFindingToolInputCodec,
  CreateSlicePlanToolInputCodec,
  CreateSpecRecordToolInputCodec,
  EvaluateSonarQualityGateToolInputCodec,
  HandleDiscordApprovalToolInputCodec,
  HandleDiscordControlToolInputCodec,
  OpenDiscordThreadToolInputCodec,
  PlanRebaseDependentsToolInputCodec,
  RunGatesToolInputCodec,
  RunSupervisorStepToolInputCodec,
  SubmitGitHubActionToolInputCodec,
  SubmitPullRequestUpdateToolInputCodec,
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

export function createResearchBriefTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'create_research_brief',
    label: 'Create Research Brief',
    description:
      'Normalize a research brief and return it as a structured DevPlat artifact.',
    parameters: readSchema(
      'tool-create-research-brief-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        CreateResearchBriefToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const artifact = new ResearchBriefService().toArtifact(decoded.value);
      return Promise.resolve(createTextResult(artifact));
    },
  };

  return tool;
}

export function createSpecRecordTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'create_spec_record',
    label: 'Create Spec Record',
    description:
      'Normalize a spec record and return it as a structured DevPlat artifact.',
    parameters: readSchema(
      'tool-create-spec-record-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(CreateSpecRecordToolInputCodec, params);
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const artifact = new SpecRecordService().toArtifact(decoded.value);
      return Promise.resolve(createTextResult(artifact));
    },
  };

  return tool;
}

export function createSlicePlanTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'create_slice_plan',
    label: 'Create Slice Plan',
    description:
      'Normalize a dependency-aware slice plan for implementation routing.',
    parameters: readSchema(
      'tool-create-slice-plan-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(CreateSlicePlanToolInputCodec, params);
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const plan = new SlicePlanService().plan(decoded.value);
      return Promise.resolve(createTextResult(plan));
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

export function createBindDiscordThreadTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'bind_discord_thread',
    label: 'Bind Discord Thread',
    description:
      'Bind a Discord thread to a deterministic spec, implementation, or audit routing key.',
    parameters: readSchema(
      'tool-bind-discord-thread-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(BindDiscordThreadToolInputCodec, params);
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result = await new DiscordChannelBindingService().bindThread(
        {
          id: decoded.value.id,
          summary: decoded.value.summary,
          status: decoded.value.status,
          trace: decoded.value.trace,
          updatedAt: decoded.value.updatedAt,
          guildId: decoded.value.guildId,
          channelId: decoded.value.channelId,
          kind: decoded.value.kind,
          threadBindingMode: decoded.value.threadBindingMode,
        },
        decoded.value.threadId,
        decoded.value.parentChannelId,
        decoded.value.actorId,
      );
      return createTextResult(result);
    },
  };

  return tool;
}

export function createOpenDiscordThreadTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'open_discord_thread',
    label: 'Open Discord Thread',
    description:
      'Open and persist a Discord spec or implementation thread session with audit artifacts.',
    parameters: readSchema(
      'tool-open-discord-thread-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(OpenDiscordThreadToolInputCodec, params);
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result = await new DiscordThreadSessionService().openThread(
        {
          id: decoded.value.id,
          summary: decoded.value.summary,
          status: decoded.value.status,
          trace: decoded.value.trace,
          updatedAt: decoded.value.updatedAt,
          guildId: decoded.value.guildId,
          channelId: decoded.value.channelId,
          parentChannelId: decoded.value.parentChannelId,
          threadId: decoded.value.threadId,
          kind: decoded.value.kind,
          specId: decoded.value.specId,
          sliceId: decoded.value.sliceId,
          artifactId: decoded.value.artifactId,
        },
        decoded.value.actorId,
      );
      return createTextResult(result);
    },
  };

  return tool;
}

export function createHandleDiscordApprovalTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'handle_discord_approval',
    label: 'Handle Discord Approval',
    description:
      'Process a Discord approval action with policy enforcement, audit artifacts, and telemetry.',
    parameters: readSchema(
      'tool-handle-discord-approval-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        HandleDiscordApprovalToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result =
        await new DiscordInteractiveApprovalService().handleApproval(
          decoded.value,
        );
      return createTextResult(result);
    },
  };

  return tool;
}

export function createHandleDiscordControlTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'handle_discord_control',
    label: 'Handle Discord Control',
    description:
      'Process a thread-scoped Discord control action with policy checks and telemetry.',
    parameters: readSchema(
      'tool-handle-discord-control-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        HandleDiscordControlToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result = await new DiscordControlPlaneService().handleAction(
        decoded.value,
      );
      return createTextResult(result);
    },
  };

  return tool;
}

export function createEvaluateSonarQualityGateTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'evaluate_sonar_quality_gate',
    label: 'Evaluate Sonar Quality Gate',
    description:
      'Evaluate Sonar coverage and blocking-issue thresholds against DevPlat policy.',
    parameters: readSchema(
      'tool-evaluate-sonar-quality-gate-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        EvaluateSonarQualityGateToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const result = new SonarQualityGateService().evaluate(
        decoded.value.projectKey,
        decoded.value.overallCoverage,
        decoded.value.newCodeCoverage,
        decoded.value.blockingIssues,
      );
      return Promise.resolve(createTextResult(result));
    },
  };

  return tool;
}

export function createReviewFindingTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'create_review_finding',
    label: 'Create Review Finding',
    description:
      'Normalize a review finding and return it as a structured DevPlat artifact.',
    parameters: readSchema(
      'tool-create-review-finding-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        CreateReviewFindingToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const artifact = new ReviewFindingsService().toArtifact(decoded.value);
      return Promise.resolve(createTextResult(artifact));
    },
  };

  return tool;
}

export function createRemediationPlanTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'create_remediation_plan',
    label: 'Create Remediation Plan',
    description:
      'Create a remediation plan from review findings while preserving approval rules.',
    parameters: readSchema(
      'tool-create-remediation-plan-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        CreateRemediationPlanToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const plan = new RemediationPlanService().fromFindings(
        decoded.value.findings,
        decoded.value.autofix,
      );
      return Promise.resolve(createTextResult(plan));
    },
  };

  return tool;
}

export function createSubmitPullRequestUpdateTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'submit_pull_request_update',
    label: 'Submit Pull Request Update',
    description:
      'Submit a pull request update decision through the GitHub workflow adapter.',
    parameters: readSchema(
      'tool-submit-pull-request-update-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        SubmitPullRequestUpdateToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result = await new PullRequestService().submitUpdate(
        decoded.value.record,
        decoded.value.actorId,
      );
      return createTextResult(result);
    },
  };

  return tool;
}

export function createPlanRebaseDependentsTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'plan_rebase_dependents',
    label: 'Plan Rebase Dependents',
    description:
      'Create a downstream rebase plan for branches that depend on a merged pull request.',
    parameters: readSchema(
      'tool-plan-rebase-dependents-params.schema.json',
    ) as unknown,
    execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(
        PlanRebaseDependentsToolInputCodec,
        params,
      );
      if (!decoded.ok) {
        return Promise.resolve(
          createTextResult({ status: 'failed', error: decoded.error }),
        );
      }

      const plan = new RebaseDependentsService().createForMerge(
        decoded.value.record,
        decoded.value.dependentBranches,
      );
      return Promise.resolve(createTextResult(plan));
    },
  };

  return tool;
}

export function createSubmitGitHubActionTool(): AnyAgentTool {
  const tool: AnyAgentTool = {
    name: 'submit_github_action',
    label: 'Submit GitHub Action',
    description:
      'Submit a GitHub workflow action request through the policy- and telemetry-aware adapter.',
    parameters: readSchema(
      'tool-submit-github-action-params.schema.json',
    ) as unknown,
    async execute(_toolCallId: string, params: unknown) {
      const decoded = decodeWithCodec(SubmitGitHubActionToolInputCodec, params);
      if (!decoded.ok) {
        return createTextResult({ status: 'failed', error: decoded.error });
      }

      const result = await new GitHubWorkflowService().submit(
        decoded.value.request,
        decoded.value.actorId,
      );
      return createTextResult(result);
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
