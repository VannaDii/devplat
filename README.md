# DevPlat

DevPlat is a Discord-first autonomous development platform scaffolded as a strict TypeScript monorepo. The foundation emphasizes reproducibility, auditable artifacts, OpenClaw compatibility, strict package boundaries, and quality gates from the first commit.

## Requirements

- Node.js `v24.14.1`
- npm `>=11.0.0`
- `nvm`

Always activate the pinned runtime before development:

```bash
nvm use
npm ci
```

## Workspace Layout

- `packages/core`: shared domain primitives and exactness helpers
- `packages/config`: runtime configuration loading and normalization
- `packages/artifacts`: versioned artifact contracts
- `packages/memory`: persistent project memory domain
- `packages/research`: research-backed discovery flows
- `packages/specs`: spec lifecycle management
- `packages/slicing`: dependency-aware slice planning
- `packages/queue`: task queue and lifecycle state machine
- `packages/worktrees`: worktree allocation and synchronization
- `packages/execution`: subprocess execution runtime
- `packages/gates`: quality gate orchestration
- `packages/sonarcloud`: SonarCloud integration and compliance logic
- `packages/review`: automated review engine
- `packages/remediation`: remediation planning
- `packages/prs`: pull request lifecycle management
- `packages/branching`: downstream branch coordination
- `packages/supervisor`: orchestration brain
- `packages/observability`: telemetry and traceability
- `packages/github`: GitHub-native integration
- `packages/openclaw`: OpenClaw adapter only
- `packages/discord`: Discord control plane workflows
- `packages/policy`: privileged action governance
- `packages/storage`: lightweight `.devplat` persistence wrapper

## Common Commands

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run docs:build
npm run generate:schemas
npm run check:schemas
npm run check:repo
```

## Engineering Guardrails

- Use `nvm use` before every install, build, lint, typecheck, or test run.
- Keep runtime contracts aligned across TypeScript types, `io-ts` codecs, and generated JSON Schemas.
- Tests live sibling to the units they verify and must isolate both failure source and downstream impact.
- OpenClaw code stays adapter-only. Business logic belongs in the platform packages.

## Distribution Surfaces

- `docker/openclaw-runtime`: Alpine-based OpenClaw gateway runtime image
- `deploy/helm/devplat`: Helm chart for Kubernetes and k3s deployment
- `site/guide-docs`: VitePress documentation site published through GitHub Pages
