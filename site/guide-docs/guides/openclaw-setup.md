# OpenClaw Setup

## Local Development

```bash
nvm use
npm ci
npm run prepare:generated
npm run build
```

The OpenClaw adapter lives in `packages/openclaw`. It is intentionally adapter-only: it reads generated schemas, decodes tool input with platform codecs, and delegates lifecycle behavior to platform services. Domain logic and public contract ownership stay in platform packages even when OpenClaw is the only current caller.

## Running the Gateway

```bash
npm run build
./node_modules/.bin/openclaw gateway run
```

The runtime expects OpenClaw configuration through environment variables, mounted config, or explicit CLI arguments.

## Platform Context

- GitHub remains the system of record for specs, pull requests, reviews, and merges.
- Discord remains the primary operator control plane.
- OpenClaw exposes the platform into that control plane without taking ownership of platform state.
- OpenClaw tool handlers should validate, delegate, and format results rather than accumulate business logic near the entrypoint.
- `PLATFORM.md` defines the required foundation-phase tool surface; the adapter must expose that surface without re-owning the behavior.

## Tool Surface

The adapter exposes research, specs, slicing, runtime config, artifacts, GitHub, Discord, SonarCloud, task queue, storage, worktrees, execution, policy, telemetry, and supervisor capabilities. Keep required tool names documented in `packages/openclaw/README.md`, keep the manifest deterministic, and keep Discord-related tools thread-aware.
