import { describeValidatedArtifact, validateArtifact } from './logic.js';
import type { KnownArtifact } from './types.js';
import type { DevplatResult } from '@vannadii/devplat-core';

export class ArtifactValidationService {
  public execute(input: unknown): DevplatResult<KnownArtifact> {
    return validateArtifact(input);
  }

  public explain(input: KnownArtifact): string {
    return describeValidatedArtifact(input);
  }
}
