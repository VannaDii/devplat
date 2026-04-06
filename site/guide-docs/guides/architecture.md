# Architecture

The platform is split into contract packages, orchestration packages, adapter packages, and distribution surfaces.

## Layers

- `core`, `artifacts`, `config`, `policy`: shared primitives and normalized contracts
- `research`, `specs`, `slicing`, `queue`, `worktrees`, `execution`, `gates`, `review`, `remediation`, `prs`, `branching`, `supervisor`: platform workflows and lifecycle services
- `observability`, `storage`, `github`, `discord`, `sonarcloud`: infrastructure-facing platform packages
- `openclaw`: thin adapter that registers platform services as OpenClaw tools

## Enforcement

- Cross-package relative imports are forbidden
- `package.json` dependencies, `tsconfig.json` references, and actual imports are validated together
- Circular workspace dependencies fail validation
- Generated schemas and the OpenClaw manifest are treated as committed artifacts

## Delivery

- GitHub Actions provides strict CI, compatibility CI, release PR automation, Docker publication, Helm chart publication, and GitHub Pages deployment
- `docker/openclaw-runtime` builds a self-hosted gateway image
- `deploy/helm/devplat` packages that image for Kubernetes and k3s
