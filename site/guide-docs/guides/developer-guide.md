# Developer Guide

## Daily Loop

```bash
nvm use
npm ci
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

## Repository Validation

- `npm run check:packages`
- `npm run check:exports`
- `npm run check:dependency-graph`
- `npm run check:schemas`
- `npm run check:openclaw-manifest`
- `npm run check:repo`

## Contribution Rules

- Keep `logic.ts` pure and directly tested
- Keep `service.ts` focused on delegation and side-effect boundaries
- Do not weaken strict TypeScript or ESLint rules
- Do not move business logic into the OpenClaw adapter
