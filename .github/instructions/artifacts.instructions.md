# Artifact Instructions

## Artifact Contract

- All handoffs must be machine-readable, versioned artifacts.
- Public artifact changes require aligned TypeScript types, `io-ts` codecs, generated schemas, docs, and tests.
- Do not hand-edit generated schema or manifest outputs.

## Lifecycle Coverage

- Research, specs, approvals, slice plans, reviews, remediation plans, policy decisions, and release-related handoffs must remain auditable and structured.
- Artifact summaries should explain operational meaning, not just repeat identifiers.
- Prefer stable, additive contract evolution so operator and automation surfaces stay compatible.

## Audit Expectations

- Artifacts that represent approvals, reviews, policy decisions, retries, rebases, or releases must remain traceable to GitHub state.
- Do not allow Discord or OpenClaw interactions to create hidden state that bypasses artifact capture.
