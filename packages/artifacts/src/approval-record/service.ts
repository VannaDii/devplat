import {
  createApprovalRecordArtifact,
  describeApprovalRecordArtifact,
} from './logic.js';
import type { ApprovalRecordArtifact } from './types.js';

export class ApprovalRecordArtifactService {
  public execute(input: ApprovalRecordArtifact): ApprovalRecordArtifact {
    return createApprovalRecordArtifact(input);
  }

  public explain(input: ApprovalRecordArtifact): string {
    return describeApprovalRecordArtifact(input);
  }
}
