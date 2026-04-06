# Developer Guide

## Daily Loop

```bash
nvm use
npm ci
npm run check:repo
npm run test:coverage
npm run docs:build
```

Use `npm run check:pre-push` as the canonical local gate before pushing.

Use the root `PLATFORM.md` file as the authoritative foundation-scope document. This guide focuses on the implementation discipline that keeps work aligned with that objective.

## Repository Validation

- `npm run check:packages`
- `npm run check:exports`
- `npm run check:dependency-graph`
- `npm run check:schemas`
- `npm run check:openclaw-manifest`
- `npm run check:instructions`
- `npm run check:naming`
- `npm run check:policy-boundaries`
- `npm run check:repo`

## Instruction Taxonomy

- `AGENTS.md`: terse coding-agent rules
- `PLATFORM.md`: completion scope, package responsibilities, and acceptance criteria
- `CONTRIBUTING.md`: human workflow, review, and release contract
- `.github/copilot-instructions.md`: AI pair-programming contract
- `.github/instructions/platform.instructions.md`: project objective, non-goals, platform model, and lifecycle
- `.github/instructions/performance.instructions.md`: complete-change and performance expectations
- `.github/instructions/release.instructions.md`: publication and rollback rules
- `guides/platform-lifecycle.md`: end-to-end execution flow
- `guides/quality-performance-policy.md`: quality, completeness, and benchmark policy
- `guides/publishing-release.md`: release, publication, and rollback surfaces

## Package Contract

- Keep package responsibilities aligned with `PLATFORM.md`.
- For package normalization work, add or preserve `package.json`, `tsconfig.json`, `src/index.ts`, strict exports, and repo-standard scripts.
- Use public package entrypoints only and keep adapter packages out of domain-logic ownership.
- Treat package `README.md` coverage as part of package completion when publishability or operator-facing behavior changes.
- Keep package `README.md` coverage on the remaining normalization backlog until every publishable package has one.

## Complete Change Standard

- keep `logic.ts` pure and `service.ts` focused on orchestration and side-effect boundaries
- keep public contracts aligned across types, codecs, generated schemas, and docs
- keep GitHub, Discord, OpenClaw, and operator-facing behavior auditable
- keep Discord interactions thread-aware and fail closed on missing or ambiguous thread context
- keep branch names and pull request titles free of registered tool names
- treat `codex` as a reserved tool name and keep it out of branch names and pull request titles
- keep pull request titles in conventional commit format
- keep pull request bodies aligned with `.github/pull_request_template.md` and fill every section with concrete change details
- keep tests in structured `const cases = [...]` tables where each case provides `inputs`, `mock`, and `assert`, then exercises a single implementation per suite
- document release, rollback, and performance impact when a change touches those surfaces
