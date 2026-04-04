import type { ArtifactEnvelope } from '../artifact-envelope/types.js';
import type { ApprovalRecordArtifact } from '../approval-record/types.js';
import type { AuditLogArtifact } from '../audit-log/types.js';
import type { MergeDecisionArtifact } from '../merge-decision/types.js';
import type { RebaseResultArtifact } from '../rebase-result/types.js';

export type KnownArtifact =
  | ApprovalRecordArtifact
  | AuditLogArtifact
  | MergeDecisionArtifact
  | RebaseResultArtifact
  | ArtifactEnvelope;
