# Configuration Reference

## Node and Package Manager

- `.nvmrc` pins the development baseline to Node `24.14.1`
- `packageManager` pins npm `11.12.1`

## TypeScript

- Primary development compiler: TypeScript `6.0.2`
- Compatibility CI: latest stable `5.x` and `6.x`
- `NodeNext` module settings are enforced across source packages

## OpenClaw and Discord

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
- Plugin manifest: `packages/openclaw/openclaw.plugin.json`
