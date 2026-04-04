import {
  createRebaseResultArtifact,
  describeRebaseResultArtifact,
} from './logic.js';
import type { RebaseResultArtifact } from './types.js';

export class RebaseResultArtifactService {
  public execute(input: RebaseResultArtifact): RebaseResultArtifact {
    return createRebaseResultArtifact(input);
  }

  public explain(input: RebaseResultArtifact): string {
    return describeRebaseResultArtifact(input);
  }
}
