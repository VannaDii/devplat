# DevPlat Copilot Instructions

- Treat this repository as compliance-first infrastructure code, not as a prototype or a convenience script collection.
- Use `nvm use` before any install, test, lint, typecheck, or build guidance.
- Keep every unit in folder-per-unit structure with `types.ts`, `codec.ts`, `logic.ts`, `logic.test.ts`, `service.ts`, and `service.test.ts`.
- Keep `logic.ts` pure. Put orchestration, IO, and framework glue in `service.ts`.
- In `NodeNext` ESM source files, use explicit relative `.js` specifiers. Do not switch local imports or exports to extensionless paths.
- Use `io-ts` for runtime codecs and committed JSON Schemas generated from exported TypeScript types.
- Never hand-edit generated schema files.
- Never place business logic inside decorators or inside `@vannadii/devplat-openclaw`.
- Only `@vannadii/devplat-storage` may access `.devplat/` directly.
- Preserve strict package boundaries. Do not deep-import another package's `src`.
- Prefer explicit, traceable behavior over hidden convenience.
- Add or update tests so failures reveal both the broken unit and the downstream impact.
- Do not weaken TypeScript, ESLint, coverage, schema, policy, or audit requirements to make a change easier.
