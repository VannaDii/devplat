import { decodeWithCodec, type DevplatResult } from '@vannadii/devplat-core';

import {
  ArtifactEnvelopeCodec,
  ArtifactEnvelopeService,
} from '../artifact-envelope/index.js';
import {
  ApprovalRecordArtifactCodec,
  ApprovalRecordArtifactService,
} from '../approval-record/index.js';
import {
  AuditLogArtifactCodec,
  AuditLogArtifactService,
} from '../audit-log/index.js';
import {
  MergeDecisionArtifactCodec,
  MergeDecisionArtifactService,
} from '../merge-decision/index.js';
import {
  RebaseResultArtifactCodec,
  RebaseResultArtifactService,
} from '../rebase-result/index.js';
import type { KnownArtifact } from './types.js';

export function validateArtifact(input: unknown): DevplatResult<KnownArtifact> {
  const envelope = decodeWithCodec(ArtifactEnvelopeCodec, input);
  if (!envelope.ok) {
    return envelope;
  }

  switch (envelope.value.artifactType) {
    case 'approval-record': {
      const artifact = decodeWithCodec(ApprovalRecordArtifactCodec, input);
      if (!artifact.ok) {
        return artifact;
      }

      return {
        ok: true,
        value: new ApprovalRecordArtifactService().execute(artifact.value),
      };
    }
    case 'audit-log': {
      const artifact = decodeWithCodec(AuditLogArtifactCodec, input);
      if (!artifact.ok) {
        return artifact;
      }

      return {
        ok: true,
        value: new AuditLogArtifactService().execute(artifact.value),
      };
    }
    case 'merge-decision': {
      const artifact = decodeWithCodec(MergeDecisionArtifactCodec, input);
      if (!artifact.ok) {
        return artifact;
      }

      return {
        ok: true,
        value: new MergeDecisionArtifactService().execute(artifact.value),
      };
    }
    case 'rebase-result': {
      const artifact = decodeWithCodec(RebaseResultArtifactCodec, input);
      if (!artifact.ok) {
        return artifact;
      }

      return {
        ok: true,
        value: new RebaseResultArtifactService().execute(artifact.value),
      };
    }
    default:
      return {
        ok: true,
        value: new ArtifactEnvelopeService().execute(envelope.value),
      };
  }
}

export function describeValidatedArtifact(input: KnownArtifact): string {
  return `${input.artifactType}@v${String(input.version)}`;
}
