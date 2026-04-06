# Architecture

DevPlat is a platform core plus adapters, not one giant OpenClaw plugin.

## Platform Model

- platform packages own domain logic, orchestration, contracts, and persistence
- `@vannadii/devplat-openclaw` exposes the platform into OpenClaw
- Discord is the primary operator control plane through OpenClaw
- OpenClaw and Discord may initiate workflows, but they do not own domain logic or public contracts
- GitHub is the system of record for specs, pull requests, reviews, and merge history
- SonarCloud provides quality and compliance signals
- Docker, Helm, and GitHub Pages are delivery surfaces

The authoritative foundation scope, package responsibilities, and acceptance criteria live in the root `PLATFORM.md`. This guide focuses on the structural boundaries that keep implementation clean.

## Lifecycle Boundaries

- research produces a brief
- specs turn that brief into a spec PR and approval-ready record
- approved specs are sliced into implementation units
- implementation PRs run gates, review, and remediation loops
- operator actions remain auditable through Discord, OpenClaw, artifacts, and GitHub history
- Discord interactions stay thread-aware so thread context remains the unit of work for specs, slices, and pull requests

## Enforcement

- cross-package relative imports are forbidden
- `package.json` dependencies, `tsconfig.json` references, and actual imports are validated together
- circular workspace dependencies fail validation
- generated schemas and the OpenClaw manifest are treated as committed artifacts
- domain logic stays in platform packages, with pure `logic.ts` units and thin `service.ts` shells
- instruction drift and policy boundaries are validated with repo checks

## Delivery Surfaces

- GitHub Packages publishes npm packages
- GHCR publishes the runtime image and the OCI Helm chart
- GitHub Pages publishes the documentation site
