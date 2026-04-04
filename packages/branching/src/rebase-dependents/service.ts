import type { PullRequestRecord } from '@vannadii/devplat-prs';

import { createRebasePlan, describeRebasePlan } from './logic.js';
import type { RebasePlan } from './types.js';

export class RebaseDependentsService {
  public create(input: RebasePlan): RebasePlan {
    return createRebasePlan(input);
  }

  public execute(input: RebasePlan): RebasePlan {
    return this.create(input);
  }

  public createForMerge(
    input: PullRequestRecord,
    dependentBranches: readonly string[],
  ): RebasePlan {
    return createRebasePlan({
      mergedPrNumber: input.prNumber,
      baseBranch: input.baseBranch,
      dependentBranches: [...dependentBranches],
      rebaseRequired: dependentBranches.length > 0,
      conflictsExpected: false,
      updatedAt: input.updatedAt,
    });
  }

  public explain(input: RebasePlan): string {
    return describeRebasePlan(input);
  }
}
