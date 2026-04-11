# Operator Guide

## System Roles

- GitHub is the source of truth for specs, pull requests, reviews, approvals, and merge history.
- Discord is the primary operator control plane through OpenClaw.
- SonarCloud provides quality and compliance signals.
- Docker, Helm, and GitHub Pages are the published delivery surfaces.

## Day-0

- build or pull the runtime image
- provide OpenClaw, Discord, GitHub, and Sonar credentials through environment variables, mounted config, or referenced secrets
- set Discord v10 connection values: API base URL, application id, public key, bot token, guild id, and the spec, implementation, pull-request, audit, and project-management channel ids
- start the gateway locally, in Docker, or via Helm on k3s

## Day-1

- watch GitHub Actions CI, the TypeScript compatibility matrix, Docker, Helm, and docs workflows
- monitor SonarCloud gate status
- verify that operator-visible Discord actions map back to GitHub and artifact state
- keep the project-management channel query-only and ensure every result points back to a bound work thread
- rotate credentials through secret references instead of baking them into images

## Recovery

- re-run `npm run prepare:generated` if committed artifacts drift
- use `npm run check:repo` to isolate structure, export, dependency, schema, manifest, instruction, or policy drift
- keep rollback actions tied to GitHub state and documented release notes
