# Platform Instructions

## Objective

- DevPlat must operate as a contained autonomous software-delivery platform.
- Use `PLATFORM.md` as the authoritative completion-scope document for required packages, delivery surfaces, workflows, and acceptance criteria.
- The instruction layer should focus on how work is implemented, validated, and kept auditable while `PLATFORM.md` preserves the full foundation objective.

## Non-goals

- Do not build business logic inside the OpenClaw adapter.
- Do not make Discord the source of truth for code state.
- Do not require a special docs branch.
- Do not optimize for Windows or macOS runtime support right now.
- Do not broaden compatibility beyond Linux for the TypeScript `5.x` and `6.x` matrix.
- Do not weaken strict TypeScript, ESLint, or package-boundary rules for convenience.

## Platform Model

- Platform packages own domain logic, orchestration, contracts, and persistence.
- `@vannadii/devplat-openclaw` exposes the platform into OpenClaw.
- Discord is the primary operator control plane through OpenClaw.
- Discord and OpenClaw may initiate workflows, but they do not own the underlying business logic or public contracts.
- GitHub is the system of record for specs, pull requests, reviews, and merge history.
- SonarCloud is the quality and compliance signal source.
- Docker, Helm, and GitHub Pages are delivery surfaces.

## Preserved Repo Invariants

- Keep the root npm workspace and Turbo layout.
- Preserve Node `24` and npm `11` alignment through `.nvmrc`, `packageManager`, engines, and verification scripts.
- Preserve generated schema and OpenClaw manifest workflows.
- Preserve docs-site publication through the existing GitHub Pages flow.
- Preserve SonarCloud bootstrap and quality-gate expectations in CI.

## Implementation Posture

- Preserve the package inventory and package responsibilities defined in `PLATFORM.md`.
- Keep instructions focused on dependency discipline, adapter boundaries, auditable control flow, and complete-change expectations.
- Treat package normalization, delivery surfaces, docs, and CI completeness as foundation work, not optional follow-up.

## Foundation Phases

1. Normalize package shape, exports, and dependency boundaries before expanding runtime surfaces.
2. Complete the adapter and control-plane surface before adding release-time convenience behavior.
3. Finish docs, compatibility validation, Docker, Helm, and SonarCloud tightening in the phase order defined by `PLATFORM.md`.
4. Keep each phase merge-ready by updating validation, docs, and release metadata in the same change.

## Acceptance Discipline

- A foundation change is not complete until it satisfies the relevant acceptance criteria from `PLATFORM.md`.
- Keep GitHub, Discord, OpenClaw, generated artifacts, and documentation synchronized as a single delivery contract.
- Treat thread-aware Discord control, adapter-only OpenClaw behavior, and auditable lifecycle state as non-negotiable completion properties.
