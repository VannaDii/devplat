# DevPlat Foundation Completion Spec

## Summary

DevPlat is a Discord-first autonomous development platform delivered as a strict TypeScript monorepo. It uses OpenClaw as the runtime and control plane, GitHub as the source of truth for code workflow, SonarCloud for quality and compliance, GitHub Packages for npm distribution, GHCR for container and Helm distribution, and GitHub Pages for documentation.

The current repository already establishes the monorepo structure, strict TypeScript and linting discipline, package layout covering platform domains, docs workspace, and distribution placeholders. This spec defines completion of the platform foundation, including distribution, deployment, documentation, adapter surfaces, and CI enforcement.

## Goals

- Normalize all packages into a clean, enforceable architecture.
- Deliver a complete OpenClaw adapter exposing the platform.
- Deliver Docker runtime and Helm deployment artifacts.
- Deliver a full documentation site with GitHub Pages publishing.
- Deliver CI and CD pipelines covering lint, typecheck, test, docs, quality, packaging, and publishing.
- Enforce strict engineering discipline from day one.
- Support Discord as the primary human interaction surface with full auditability.

## Non-goals

- Full autonomous development logic implementation.
- Multi-platform runtime beyond Linux containers.
- Full production-grade distributed storage abstraction.
- Backward compatibility for legacy TypeScript versions beyond the explicit matrix.

## Technology Standards

- Node.js: `>= 24`, pinned via `.nvmrc`
- npm: `>= 11`
- TypeScript authoring baseline: latest stable `6.x`
- TypeScript compatibility matrix: latest stable `5.x` and `6.x`
- Module system: ESM with `NodeNext`
- Runtime target: Linux containers
- Container base: latest stable Alpine Linux
- Docs: VitePress
- CI and CD: GitHub Actions
- Quality gate: SonarCloud

## Repository Structure

- `packages/`: platform, integration, adapter, and control-plane packages
- `docker/openclaw-runtime/`: container runtime
- `deploy/helm/devplat/`: OCI Helm chart
- `site/guide-docs/`: VitePress documentation site
- `scripts/`: repo validation and generation scripts
- `.github/workflows/`: CI, release, publishing, and deployment workflows

## Package Responsibilities

### Core Layer

- `@vannadii/devplat-core`: IDs, enums, result types, error types, lifecycle state definitions, and zero-side-effect shared interfaces
- `@vannadii/devplat-config`: environment parsing, typed configuration, defaults, and overrides
- `@vannadii/devplat-artifacts`: artifact schemas, versioned contracts, and validation utilities

### Planning Layer

- `@vannadii/devplat-memory`: persistent knowledge, decisions, constraints, and history
- `@vannadii/devplat-research`: intelligence gathering and feasibility analysis
- `@vannadii/devplat-specs`: spec authoring, lifecycle, and spec pull request generation
- `@vannadii/devplat-slicing`: decomposition into implementation units and slice dependency graphs

### Execution Layer

- `@vannadii/devplat-queue`: task lifecycle state machine and queue coordination
- `@vannadii/devplat-worktrees`: git worktree management and branch-safe isolation
- `@vannadii/devplat-execution`: subprocess execution and structured logs and results
- `@vannadii/devplat-gates`: build, lint, typecheck, test, coverage orchestration, and failure classification

### Review Layer

- `@vannadii/devplat-review`: automated code and spec review
- `@vannadii/devplat-remediation`: fix planning and safe autofix application

### Delivery Layer

- `@vannadii/devplat-prs`: pull request creation, updates, and comment syncing
- `@vannadii/devplat-branching`: rebase orchestration and dependency-aware branch updates

### Control Layer

- `@vannadii/devplat-supervisor`: orchestration loop, task routing, and escalation decisions
- `@vannadii/devplat-observability`: metrics, logs, and audit trail

### Integrations

- `@vannadii/devplat-github`: repository and pull request interactions
- `@vannadii/devplat-sonarcloud`: quality gate integration and issue ingestion

### Control Planes

- `@vannadii/devplat-openclaw`: adapter only, registers all platform tools, no business logic
- `@vannadii/devplat-discord`: primary human interface and workflow orchestration via threads
- `@vannadii/devplat-policy`: governance rules and approval constraints
- `@vannadii/devplat-storage`: persistence abstraction

## OpenClaw Adapter Requirements

- Expose all required platform capabilities as tools.
- Map tool calls to platform packages instead of reimplementing them.
- Register routes and services only where adapter transport requires them.
- Generate `openclaw.plugin.json` deterministically.
- Remain logic-free beyond adapter validation, translation, and formatting.

## Discord Workflow Model

### Core Requirement

All interactions MUST be thread-aware.

### Rules

- Every spec, slice, and pull request must have a dedicated thread.
- No global command execution without explicit scoping.
- All actions must resolve context from thread metadata.

### Interaction Types

- `run this`: execute in thread context
- `approve this`: approve the current spec, slice, or pull request state
- `retry`: re-run failed gates or remediation
- `merge`: trigger the merge pipeline
- `rebase dependents`: trigger branching coordination

### Guarantees

- every action is auditable
- no context leakage between threads
- thread == unit of work

## Documentation Site

### Required Guide Set

- introduction
- architecture overview
- package reference
- OpenClaw setup and usage
- Discord workflows
- configuration reference
- examples and end-to-end flows
- Docker runtime usage
- Helm and k3s deployment
- SonarCloud setup and expectations
- operator guide
- developer guide

### Publishing

- GitHub Actions builds and deploys the site.
- Deploy through the Pages artifact flow.
- Do not use a `gh-pages` branch.
- Do not use a custom domain.

## Docker Runtime

- Location: `docker/openclaw-runtime/`
- Alpine-based image
- Node aligned with `.nvmrc`
- OpenClaw installed
- DevPlat installed
- entrypoint starts the OpenClaw gateway
- configurable via environment
- published to GHCR with tagged and `latest` variants

## Helm Chart

- Location: `deploy/helm/devplat/`
- deployment and service templates
- `values.yaml` configuration
- optional PVC and ingress
- GHCR image reference
- k3s compatibility
- OCI chart published to GHCR

## CI and CD Requirements

### CI

- lint
- typecheck
- test
- build
- docs build
- SonarCloud scan

### TypeScript Matrix

- TS6 primary lane
- TS5 compatibility lane
- Linux only
- runs typecheck, test, and build

### Release and Distribution

- Changesets release pull request flow
- npm publication to GitHub Packages
- Docker publication to GHCR
- Helm OCI publication to GHCR
- docs build and deploy through GitHub Pages

## SonarCloud

- integrate Vitest coverage
- enforce the quality gate
- exclude `dist`, generated schemas, coverage artifacts, and transient workspace data

## Hooks

### Pre-commit

- verify Node version
- generate schemas and manifest
- stage generated files
- run lint-staged
- run typecheck
- validate schemas

### Pre-push

- run the full repo checks

## Validation Scripts

Must enforce:

- package structure
- exports correctness
- dependency graph rules
- schema integrity
- manifest correctness

## Acceptance Criteria

- repo builds cleanly
- TypeScript `5.x` and `6.x` Linux matrix passes
- SonarCloud quality gate passes
- Docker image builds and publishes
- Helm chart packages and publishes
- docs deploy successfully
- OpenClaw exposes the full required platform surface
- Discord workflows are thread-aware and auditable
- docs fully explain setup and usage

## Implementation Phases

### Phase 1

- package normalization
- dependency enforcement
- adapter surface completion

### Phase 2

- docs site
- TypeScript matrix
- CI expansion

### Phase 3

- Docker runtime
- GHCR publication

### Phase 4

- Helm chart
- k3s deployment readiness

### Phase 5

- SonarCloud hardening
- final polish

## Final Principle

DevPlat is a deterministic, auditable, thread-aware system for producing and evolving code.
