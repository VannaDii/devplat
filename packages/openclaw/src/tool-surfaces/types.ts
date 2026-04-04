import type {
  DiscordApprovalRequest,
  DiscordChannelBinding,
  DiscordControlRequest,
  DiscordThreadSession,
} from '@vannadii/devplat-discord';
import type { ResearchBrief } from '@vannadii/devplat-research';
import type { SlicePlan } from '@vannadii/devplat-slicing';
import type { SpecRecord } from '@vannadii/devplat-specs';

export interface RunGatesToolInput {
  gateNames: string[];
  summary: string;
}

export type CreateResearchBriefToolInput = ResearchBrief;

export type CreateSpecRecordToolInput = SpecRecord;

export type CreateSlicePlanToolInput = SlicePlan;

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
