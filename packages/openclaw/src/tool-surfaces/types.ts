import type {
  DiscordApprovalRequest,
  DiscordChannelBinding,
  DiscordControlRequest,
  DiscordThreadSession,
} from '@vannadii/devplat-discord';
import type {
  ApprovalRecordArtifact,
  ArtifactEnvelope,
  AuditLogArtifact,
  MergeDecisionArtifact,
  RebaseResultArtifact,
} from '@vannadii/devplat-artifacts';
import type { LifecycleStatus } from '@vannadii/devplat-core';
import type { GitHubActionRequest } from '@vannadii/devplat-github';
import type { MemoryEntry } from '@vannadii/devplat-memory';
import type { TelemetryEvent } from '@vannadii/devplat-observability';
import type { RebasePlan } from '@vannadii/devplat-branching';
import type { StoreScope } from '@vannadii/devplat-storage';
import type { PullRequestRecord } from '@vannadii/devplat-prs';
import type { TaskRecord } from '@vannadii/devplat-queue';
import type { ResearchBrief } from '@vannadii/devplat-research';
import type { RemediationPlan } from '@vannadii/devplat-remediation';
import type { ReviewFinding } from '@vannadii/devplat-review';
import type { SlicePlan } from '@vannadii/devplat-slicing';
import type {
  SonarBootstrapVerificationInput,
  SonarQualityGateResult,
} from '@vannadii/devplat-sonarcloud';
import type { SpecRecord } from '@vannadii/devplat-specs';

export interface RunGatesToolInput {
  gateNames: string[];
  summary: string;
}

export type CreateResearchBriefToolInput = ResearchBrief;

export type CreateSpecRecordToolInput = SpecRecord;

export type CreateSlicePlanToolInput = SlicePlan;

export interface ResolveRuntimeConfigToolInput {
  env: Record<string, string>;
}

export type CreateArtifactEnvelopeToolInput = ArtifactEnvelope;

export type CreateApprovalRecordToolInput = ApprovalRecordArtifact;

export type CreateAuditLogToolInput = AuditLogArtifact;

export type CreateMergeDecisionToolInput = MergeDecisionArtifact;

export type CreateRebaseResultToolInput = RebaseResultArtifact;

export interface AllocateWorktreeToolInput {
  taskId: string;
  branchName: string;
}

export interface BindDiscordThreadToolInput extends DiscordChannelBinding {
  threadId: string;
  parentChannelId: string;
  actorId: string;
}

export interface OpenDiscordThreadToolInput extends DiscordThreadSession {
  actorId: string;
}

export type HandleDiscordApprovalToolInput = DiscordApprovalRequest;

export type HandleDiscordControlToolInput = DiscordControlRequest;

export type VerifySonarBootstrapToolInput = SonarBootstrapVerificationInput;

export interface EvaluateSonarQualityGateToolInput {
  projectKey: SonarQualityGateResult['projectKey'];
  overallCoverage: SonarQualityGateResult['overallCoverage'];
  newCodeCoverage: SonarQualityGateResult['newCodeCoverage'];
  blockingIssues: SonarQualityGateResult['blockingIssues'];
}

export type CreateReviewFindingToolInput = ReviewFinding;

export interface CreateRemediationPlanToolInput {
  findings: ReviewFinding[];
  autofix: RemediationPlan['autofix'];
}

export interface ExecuteCommandToolInput {
  command: string;
  args: string[];
  actorId: string;
  privileged: boolean;
  cwd?: string;
  env?: Record<string, string>;
  timeoutMs?: number;
}

export type RememberMemoryEntryToolInput = MemoryEntry;

export interface EvaluatePolicyActionToolInput {
  action: string;
  privileged: boolean;
}

export type RecordTelemetryEventToolInput = TelemetryEvent;

export type CreateTaskRecordToolInput = TaskRecord;

export interface ReadStoredRecordToolInput {
  scope: StoreScope;
  key: string;
}

export interface ListStoredRecordsToolInput {
  scope: StoreScope;
}

export interface StoreRecordToolRecord {
  id: string;
  key: string;
  scope: StoreScope;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
  payload: Record<string, unknown>;
}

export interface StoreRecordToolInput {
  record: StoreRecordToolRecord;
  actorId: string;
  privileged: boolean;
}

export type CreatePullRequestRecordToolInput = PullRequestRecord;

export interface SubmitPullRequestUpdateToolInput {
  record: PullRequestRecord;
  actorId: string;
}

export interface PlanRebaseDependentsToolInput {
  record: PullRequestRecord;
  dependentBranches: RebasePlan['dependentBranches'];
}

export interface SubmitGitHubActionToolInput {
  request: GitHubActionRequest;
  actorId: string;
}

export interface ClaimTaskToolInput {
  taskId: string;
  sliceId: string;
  threadId: string;
  assigneeId: string;
}

export interface UpdateTaskToolInput {
  taskId: string;
  sliceId: string;
  threadId: string;
  status:
    | 'review'
    | 'blocked'
    | 'approved'
    | 'merge-ready'
    | 'merged'
    | 'failed'
    | 'rebasing'
    | 'complete';
}

export interface ValidateArtifactToolInput {
  artifact: Record<string, unknown>;
}

export interface RunSupervisorStepToolInput {
  action: string;
  actorId: string;
  privileged: boolean;
}
