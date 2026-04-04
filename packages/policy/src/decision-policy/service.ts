import {
  createPolicyDecision,
  describePolicyDecision,
  evaluatePolicyDecision,
} from './logic.js';
import type { PolicyDecision } from './types.js';

export class DecisionPolicyService {
  public execute(input: PolicyDecision): PolicyDecision {
    return createPolicyDecision(input);
  }

  public explain(input: PolicyDecision): string {
    return describePolicyDecision(input);
  }

  public evaluateControlAction(
    action: string,
    privileged: boolean,
  ): PolicyDecision {
    return evaluatePolicyDecision(action, privileged);
  }
}
