export interface RebasePlan {
  mergedPrNumber: number;
  baseBranch: string;
  dependentBranches: string[];
  rebaseRequired: boolean;
  conflictsExpected: boolean;
  updatedAt: string;
}
