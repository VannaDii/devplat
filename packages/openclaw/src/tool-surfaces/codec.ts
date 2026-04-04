import * as t from 'io-ts';

import {
  DiscordApprovalRequestCodec,
  DiscordChannelBindingCodec,
  DiscordControlRequestCodec,
  DiscordThreadSessionCodec,
} from '@vannadii/devplat-discord';
import { ArtifactEnvelopeCodec } from '@vannadii/devplat-artifacts';
import { RebasePlanCodec } from '@vannadii/devplat-branching';
import { GitHubActionRequestCodec } from '@vannadii/devplat-github';
import { MemoryEntryCodec } from '@vannadii/devplat-memory';
import { TelemetryEventCodec } from '@vannadii/devplat-observability';
import { ResearchBriefCodec } from '@vannadii/devplat-research';
import { RemediationPlanCodec } from '@vannadii/devplat-remediation';
import { ReviewFindingCodec } from '@vannadii/devplat-review';
import { SlicePlanCodec } from '@vannadii/devplat-slicing';
import { SonarQualityGateResultCodec } from '@vannadii/devplat-sonarcloud';
import { SpecRecordCodec } from '@vannadii/devplat-specs';
import { PullRequestRecordCodec } from '@vannadii/devplat-prs';
import { StoredRecordCodec } from '@vannadii/devplat-storage';

import type {
  AllocateWorktreeToolInput,
  BindDiscordThreadToolInput,
  ClaimTaskToolInput,
  CreateRemediationPlanToolInput,
  CreateResearchBriefToolInput,
  CreateReviewFindingToolInput,
  CreateSlicePlanToolInput,
  CreateArtifactEnvelopeToolInput,
  CreateSpecRecordToolInput,
  EvaluateSonarQualityGateToolInput,
  EvaluatePolicyActionToolInput,
  HandleDiscordApprovalToolInput,
  HandleDiscordControlToolInput,
  ListStoredRecordsToolInput,
  OpenDiscordThreadToolInput,
  PlanRebaseDependentsToolInput,
  ReadStoredRecordToolInput,
  RecordTelemetryEventToolInput,
  RememberMemoryEntryToolInput,
  ResolveRuntimeConfigToolInput,
  RunGatesToolInput,
  RunSupervisorStepToolInput,
  SubmitGitHubActionToolInput,
  SubmitPullRequestUpdateToolInput,
  UpdateTaskToolInput,
  ValidateArtifactToolInput,
} from './types.js';

export const RunGatesToolInputCodec: t.Type<RunGatesToolInput> = t.type({
  gateNames: t.array(t.string),
  summary: t.string,
});

export const CreateResearchBriefToolInputCodec: t.Type<CreateResearchBriefToolInput> =
  ResearchBriefCodec as t.Type<CreateResearchBriefToolInput>;

export const CreateSpecRecordToolInputCodec: t.Type<CreateSpecRecordToolInput> =
  SpecRecordCodec as t.Type<CreateSpecRecordToolInput>;

export const CreateSlicePlanToolInputCodec: t.Type<CreateSlicePlanToolInput> =
  SlicePlanCodec as t.Type<CreateSlicePlanToolInput>;

export const ResolveRuntimeConfigToolInputCodec: t.Type<ResolveRuntimeConfigToolInput> =
  t.type({
    env: t.record(t.string, t.string),
  });

export const CreateArtifactEnvelopeToolInputCodec: t.Type<CreateArtifactEnvelopeToolInput> =
  ArtifactEnvelopeCodec as t.Type<CreateArtifactEnvelopeToolInput>;

export const AllocateWorktreeToolInputCodec: t.Type<AllocateWorktreeToolInput> =
  t.type({
    taskId: t.string,
    branchName: t.string,
  });

export const BindDiscordThreadToolInputCodec: t.Type<BindDiscordThreadToolInput> =
  t.intersection([
    DiscordChannelBindingCodec,
    t.type({
      threadId: t.string,
      parentChannelId: t.string,
      actorId: t.string,
    }),
  ]) as t.Type<BindDiscordThreadToolInput>;

export const OpenDiscordThreadToolInputCodec: t.Type<OpenDiscordThreadToolInput> =
  t.intersection([
    DiscordThreadSessionCodec,
    t.type({
      actorId: t.string,
    }),
  ]) as t.Type<OpenDiscordThreadToolInput>;

export const HandleDiscordApprovalToolInputCodec: t.Type<HandleDiscordApprovalToolInput> =
  DiscordApprovalRequestCodec as t.Type<HandleDiscordApprovalToolInput>;

export const HandleDiscordControlToolInputCodec: t.Type<HandleDiscordControlToolInput> =
  DiscordControlRequestCodec as t.Type<HandleDiscordControlToolInput>;

export const EvaluateSonarQualityGateToolInputCodec: t.Type<EvaluateSonarQualityGateToolInput> =
  t.type({
    projectKey: SonarQualityGateResultCodec.props.projectKey,
    overallCoverage: SonarQualityGateResultCodec.props.overallCoverage,
    newCodeCoverage: SonarQualityGateResultCodec.props.newCodeCoverage,
    blockingIssues: SonarQualityGateResultCodec.props.blockingIssues,
  });

export const CreateReviewFindingToolInputCodec: t.Type<CreateReviewFindingToolInput> =
  ReviewFindingCodec as t.Type<CreateReviewFindingToolInput>;

export const CreateRemediationPlanToolInputCodec: t.Type<CreateRemediationPlanToolInput> =
  t.type({
    findings: t.array(ReviewFindingCodec),
    autofix: RemediationPlanCodec.props.autofix,
  });

export const RememberMemoryEntryToolInputCodec: t.Type<RememberMemoryEntryToolInput> =
  MemoryEntryCodec as t.Type<RememberMemoryEntryToolInput>;

export const EvaluatePolicyActionToolInputCodec: t.Type<EvaluatePolicyActionToolInput> =
  t.type({
    action: t.string,
    privileged: t.boolean,
  });

export const RecordTelemetryEventToolInputCodec: t.Type<RecordTelemetryEventToolInput> =
  TelemetryEventCodec as t.Type<RecordTelemetryEventToolInput>;

export const ReadStoredRecordToolInputCodec: t.Type<ReadStoredRecordToolInput> =
  t.type({
    scope: StoredRecordCodec.props.scope,
    key: t.string,
  });

export const ListStoredRecordsToolInputCodec: t.Type<ListStoredRecordsToolInput> =
  t.type({
    scope: StoredRecordCodec.props.scope,
  });

export const SubmitPullRequestUpdateToolInputCodec: t.Type<SubmitPullRequestUpdateToolInput> =
  t.type({
    record: PullRequestRecordCodec,
    actorId: t.string,
  });

export const PlanRebaseDependentsToolInputCodec: t.Type<PlanRebaseDependentsToolInput> =
  t.type({
    record: PullRequestRecordCodec,
    dependentBranches: RebasePlanCodec.props.dependentBranches,
  });

export const SubmitGitHubActionToolInputCodec: t.Type<SubmitGitHubActionToolInput> =
  t.type({
    request: GitHubActionRequestCodec,
    actorId: t.string,
  });

export const ClaimTaskToolInputCodec: t.Type<ClaimTaskToolInput> = t.type({
  taskId: t.string,
  sliceId: t.string,
  threadId: t.string,
  assigneeId: t.string,
});

export const UpdateTaskToolInputCodec: t.Type<UpdateTaskToolInput> = t.type({
  taskId: t.string,
  sliceId: t.string,
  threadId: t.string,
  status: t.union([
    t.literal('review'),
    t.literal('blocked'),
    t.literal('approved'),
    t.literal('merge-ready'),
    t.literal('merged'),
    t.literal('failed'),
    t.literal('rebasing'),
    t.literal('complete'),
  ]),
}) as t.Type<UpdateTaskToolInput>;

export const ValidateArtifactToolInputCodec: t.Type<ValidateArtifactToolInput> =
  t.type({
    artifact: t.UnknownRecord,
  });

export const RunSupervisorStepToolInputCodec: t.Type<RunSupervisorStepToolInput> =
  t.type({
    action: t.string,
    actorId: t.string,
    privileged: t.boolean,
  });
