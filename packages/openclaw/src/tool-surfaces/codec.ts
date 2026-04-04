import * as t from 'io-ts';

import {
  DiscordApprovalRequestCodec,
  DiscordChannelBindingCodec,
  DiscordControlRequestCodec,
  DiscordThreadSessionCodec,
} from '@vannadii/devplat-discord';
import { RebasePlanCodec } from '@vannadii/devplat-branching';
import { GitHubActionRequestCodec } from '@vannadii/devplat-github';
import { ResearchBriefCodec } from '@vannadii/devplat-research';
import { RemediationPlanCodec } from '@vannadii/devplat-remediation';
import { ReviewFindingCodec } from '@vannadii/devplat-review';
import { SlicePlanCodec } from '@vannadii/devplat-slicing';
import { SonarQualityGateResultCodec } from '@vannadii/devplat-sonarcloud';
import { SpecRecordCodec } from '@vannadii/devplat-specs';
import { PullRequestRecordCodec } from '@vannadii/devplat-prs';

import type {
  AllocateWorktreeToolInput,
  BindDiscordThreadToolInput,
  ClaimTaskToolInput,
  CreateRemediationPlanToolInput,
  CreateResearchBriefToolInput,
  CreateReviewFindingToolInput,
  CreateSlicePlanToolInput,
  CreateSpecRecordToolInput,
  EvaluateSonarQualityGateToolInput,
  HandleDiscordApprovalToolInput,
  HandleDiscordControlToolInput,
  OpenDiscordThreadToolInput,
  PlanRebaseDependentsToolInput,
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
