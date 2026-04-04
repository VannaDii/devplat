# DevPlat Copilot Instructions

- Treat this repository as compliance-first infrastructure code.
- Use `nvm use` before any install or verification guidance.
- Keep units in folder-per-unit structure with `types.ts`, `codec.ts`, `logic.ts`, `logic.test.ts`, `service.ts`, and `service.test.ts`.
- Use `io-ts` for runtime codecs and generated JSON Schemas from exported TypeScript types.
- Never place business logic inside decorators or inside `@vannadii/devplat-openclaw`.
- Only `@vannadii/devplat-storage` may access `.devplat/` directly.
- Preserve strict package boundaries and avoid deep imports.
- Prefer precise, direct changes with tests that isolate failure source and downstream impact.
