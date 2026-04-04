export interface RunGatesToolInput {
  gateNames: string[];
  summary: string;
}

export interface AllocateWorktreeToolInput {
  taskId: string;
  branchName: string;
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
