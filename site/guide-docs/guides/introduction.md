# Introduction

DevPlat is organized as a strict monorepo where each package exports a narrow public surface, keeps core behavior in pure `logic.ts` units, and exposes runtime side effects through `service.ts` shells. Public contracts are backed by `io-ts` codecs and generated JSON schemas so OpenClaw, CI, and downstream operators consume the same normalized shape.

## Platform Goals

- Keep Discord-first operational flows auditable
- Treat OpenClaw as an adapter boundary, not a policy or business-logic layer
- Preserve deterministic generation for schemas and the plugin manifest
- Enforce compatibility against both TypeScript 5.x and 6.x while developing primarily on TypeScript 6

## Runtime Baseline

- Node `24.14.1`
- npm `11.12.1`
- TypeScript `6.0.2`
- Native ESM with `module` and `moduleResolution` set to `NodeNext`
