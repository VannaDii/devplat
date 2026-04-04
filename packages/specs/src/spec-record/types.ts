export type SpecApprovalState = 'draft' | 'review' | 'approved';

export interface SpecRecord {
  specId: string;
  researchId: string;
  title: string;
  objective: string;
  acceptanceCriteria: string[];
  approvalState: SpecApprovalState;
  version: number;
  updatedAt: string;
}
