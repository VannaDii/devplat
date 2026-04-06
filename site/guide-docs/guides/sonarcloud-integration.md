# SonarCloud Integration

CI runs Vitest coverage with LCOV output at `coverage/lcov.info` and waits for the SonarCloud quality gate when `SONAR_TOKEN` is available.

## Scope

- Sources: `packages`
- Tests: `packages/*/src/**/*.test.ts`
- `sonar.exclusions`: `packages/*/dist/**`, `coverage/**`, `.devplat/**`, `packages/*/schemas/*.schema.json`, `site/**`, `deploy/**`, `docker/**`
- `sonar.coverage.exclusions`: `packages/*/src/**/*.test.ts`

## Operator Notes

- Keep `SONAR_TOKEN` configured in GitHub Actions
- Use `npm run verify:sonar-bootstrap` for bootstrap validation
- Quality gate failures should stop the primary CI lane
