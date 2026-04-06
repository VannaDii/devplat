# Configuration Reference

## Node and Package Manager

- `.nvmrc` pins the development baseline to Node `24.14.1`
- `packageManager` pins `npm@11.12.1`
- runtime verification scripts ensure local and CI execution stay aligned with repository policy

## TypeScript

- primary authoring target: TypeScript `6.0.2`
- Compatibility validation runs on Linux only against the latest stable TypeScript `5.x` and `6.x` releases.
- source packages compile under `NodeNext` module settings

## Operator and Adapter Configuration

Runtime configuration normalization reads:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `OPENCLAW_PLUGIN_ID`
- `DISCORD_DEFAULT_GUILD_ID`
- `DISCORD_SPEC_CHANNEL_ID`
- `DISCORD_IMPLEMENTATION_CHANNEL_ID`
- `DISCORD_AUDIT_CHANNEL_ID`
- `SONAR_ORGANIZATION`
- `SONAR_PROJECT_KEY`

## Generated Artifacts

- JSON schemas: `packages/*/schemas/*.schema.json`
- OpenClaw manifest: `packages/openclaw/openclaw.plugin.json`
- docs publication: `site/guide-docs/.vitepress/dist`
