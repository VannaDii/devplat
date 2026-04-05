# Operator Guide

## Day-0

- Build or pull the runtime image
- Provide OpenClaw and Discord credentials through environment variables, mounted config, or referenced secrets
- Start the gateway locally, in Docker, or via Helm on k3s

## Day-1

- Watch GitHub Actions CI, TypeScript matrix, Docker, Helm, and docs workflows
- Monitor SonarCloud gate status
- Rotate any channel, GitHub, or Sonar credentials through secret references instead of baking them into images

## Recovery

- Re-run `npm run prepare:generated` if committed artifacts drift
- Use `npm run check:repo` to isolate structure, export, dependency, schema, or manifest drift
