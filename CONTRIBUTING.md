# Contributing

## Baseline

DevPlat targets Node.js `v24.14.1` and npm `11.x`.

Before doing any work:

```bash
nvm use
npm ci
```

Installs will fail if your active Node or npm version does not satisfy the repository policy.

## Workflow

1. Create a focused branch.
2. Keep changes within package boundaries.
3. Add or update sibling tests for every non-trivial unit you touch.
4. Run the required checks before pushing.

Required local checks:

```bash
npm run generate:schemas
npm run generate:openclaw-manifest
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

## Repository Rules

- Use public package entrypoints only. Do not deep-import another package’s `src`.
- `storage` is the only package allowed to access `.devplat/` directly.
- Keep business logic in `logic.ts`; keep service classes thin.
- Generated schema files and `packages/openclaw/openclaw.plugin.json` must be committed when changed.
- Keep coverage at or above 90% globally and per file.
- Use conventional commits.
- Add a changeset for any publishable package change.

## Pull Requests

Pull requests should explain:

- behavior change
- risk
- schema impact
- Discord/OpenClaw impact
- release impact

Do not hide significant behavior changes behind formatting-only commits.

## Security

Do not file public issues for vulnerabilities. Follow [`SECURITY.md`](/Users/vanna/Source/devplat/SECURITY.md).
