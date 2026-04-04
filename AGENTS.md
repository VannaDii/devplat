# DevPlat Agent Instructions

## Non-negotiable Rules

- Run `nvm use` before installs or development commands.
- Do not weaken TypeScript, ESLint, coverage, or Sonar requirements.
- Do not bypass schema generation. Public contract changes require updated codecs, generated schemas, and tests.
- Do not put business logic inside decorators or OpenClaw adapters.
- Only `@vannadii/devplat-storage` may read or write `.devplat/` paths directly.

## Coding Shape

- Use the folder-per-unit layout.
- Keep `logic.ts` pure and test it directly.
- Keep `service.ts` as the class shell and test delegation and side-effect boundaries separately.
- Export only through package and unit `index.ts` files.
- In `NodeNext` ESM source, keep relative import and export specifiers explicit with emitted `.js` extensions.
- Do not use deep imports across packages.

## Quality Bar

- Every non-trivial unit requires sibling tests.
- Test failures must reveal source and impact, not just top-level behavior.
- Preserve or improve coverage and artifact generation.
- Keep OpenClaw and Discord control flows auditable.
