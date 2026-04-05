# Docker Usage

## Build Locally

```bash
docker build \
  --build-arg NODE_VERSION="$(tr -d 'v' < .nvmrc)" \
  -f docker/openclaw-runtime/Dockerfile \
  -t devplat-openclaw-runtime:local .
```

## Run Locally

```bash
docker run --rm -p 18789:18789 devplat-openclaw-runtime:local
```

The image is based on Alpine `3.23.3`, installs Node matching the repo baseline, builds the workspace, and starts the OpenClaw gateway entrypoint.
