export interface RemediationPlan {
  planId: string;
  findingIds: string[];
  actions: string[];
  autofix: boolean;
  approvalRequired: boolean;
  updatedAt: string;
}
