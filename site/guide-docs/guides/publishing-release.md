# Publishing and Release

## Release Surfaces

DevPlat publishes through four primary surfaces:

- GitHub Packages for npm packages
- GHCR for the Docker runtime image
- GHCR OCI for the Helm chart
- GitHub Pages for documentation

## Versioning Flow

- use Changesets for release intent and package versioning
- let the `release.yml` workflow create or update the release pull request
- merge the release pull request into `main`
- let the publish workflows release packages, container artifacts, and charts from the merged state

## Publish Workflows

- `release.yml`: creates or updates the Changesets release pull request
- `publish-release.yml`: publishes packages after the release pull request merges
- `docker-publish.yml`: publishes `devplat-openclaw-runtime` to GHCR
- `helm-publish.yml`: packages and pushes the Helm chart to GHCR OCI
- `docs-deploy.yml`: builds and deploys the VitePress site through the Pages artifact flow

## Required Validation

Before a release-facing change is considered ready:

- `npm run check:repo`
- `npm run test:coverage`
- `npm run build`
- `npm run docs:build`

Release pull requests should also describe package, Docker, Helm, and docs impact explicitly in the repository pull request template.

## Rollback

- revert the release pull request or follow-up patch on `main`
- publish a correcting package release if npm versions already moved
- publish a replacement Docker image or Helm chart if runtime artifacts already moved
- redeploy docs from the corrected `main` state through the Pages workflow

Keep rollback notes concrete in the pull request so operators know which surfaces moved and which did not.
