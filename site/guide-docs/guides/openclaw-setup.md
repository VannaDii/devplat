# OpenClaw Setup

## Local Development

```bash
nvm use
npm ci
npm run prepare:generated
npm run build
```

The OpenClaw adapter lives in `packages/openclaw`. It is intentionally adapter-only: it reads generated schemas, decodes tool input with the platform codecs, and delegates to the platform services.

## Running the Gateway

```bash
npm run build
./node_modules/.bin/openclaw gateway run
```

The Docker image uses the same entrypoint and expects OpenClaw configuration to be provided through environment variables, mounted config, or explicit CLI arguments.

## Tool Surface

The adapter exposes research, specs, slicing, runtime config, artifacts, GitHub, Discord, SonarCloud, task queue, storage, worktrees, execution, policy, telemetry, and supervisor capabilities. The complete documented list lives in `packages/openclaw/README.md`.
