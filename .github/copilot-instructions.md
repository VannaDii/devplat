# DevPlat Copilot Instructions

## Operating Rules

- Treat this repository as compliance-first platform infrastructure.
- Run `nvm use` before install, test, lint, typecheck, build, or release guidance.
- Preserve strict TypeScript, ESLint, coverage, schema, policy, Sonar, and audit requirements.
- Use `PLATFORM.md` as the authoritative foundation-scope document for required packages, workflows, delivery surfaces, and acceptance criteria.
- Prefer explicit, traceable behavior over hidden convenience.

## Architectural Boundaries

- Keep platform packages responsible for domain logic, orchestration, contracts, and persistence.
- Keep `@vannadii/devplat-openclaw` adapter-only and `@vannadii/devplat-discord` focused on operator control.
- Never place business logic inside decorators, `@vannadii/devplat-openclaw`, or `@vannadii/devplat-discord`.
- Do not colocate domain logic next to OpenClaw or Discord entrypoints just because the workflow starts there.
- Keep GitHub as the source of truth for specs, pull requests, approvals, reviews, and merges.
- Keep Discord and OpenClaw thread-aware, auditable, and subordinate to GitHub state.
- Fail closed when a Discord interaction cannot be resolved to a single bound thread context.
- Only `@vannadii/devplat-storage` may access `.devplat/` directly.

## Completion Standard

- Use folder-per-unit structure with `types.ts`, `codec.ts`, `logic.ts`, `logic.test.ts`, `service.ts`, and `service.test.ts`.
- Keep `logic.ts` pure. Keep orchestration, IO, and framework glue in `service.ts`.
- Use explicit relative `.js` specifiers in `NodeNext` TypeScript source.
- Keep runtime contracts aligned across TypeScript types, `io-ts` codecs, generated schemas, docs, and tests.
- Keep Discord and OpenClaw control-plane contracts aligned with generated schemas, auditable artifacts, and the platform packages that own the behavior.
- Update docs, issue/PR templates, and release-facing artifacts when lifecycle, operator, or distribution behavior changes.
- Preserve Linux-only compatibility validation against the latest stable TypeScript `5.x` and `6.x` releases while authoring against TypeScript `6.0.2`.
