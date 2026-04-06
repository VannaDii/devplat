# Quality and Performance Policy

## Complete Change Standard

- keep strict TypeScript, ESLint, coverage, schema, Sonar, and audit expectations intact
- keep public contracts aligned across TypeScript types, codecs, generated schemas, docs, and templates
- keep GitHub, Discord, OpenClaw, and operator-visible behavior auditable
- keep rollback, release, and performance impact documented in pull requests

## Performance Expectations

- keep workflow-heavy code paths deterministic and bounded
- avoid repeated full-repository scans in request or tool-execution paths
- batch filesystem, GitHub, and SonarCloud work where correctness allows
- prefer generated artifacts and cached state over recomputation when behavior stays explicit

## Benchmark Policy

- add a measurable benchmark, timing note, or bounded-complexity explanation when changing a hot path
- call out performance impact in pull requests when a change touches slicing, queueing, supervisor cycles, review, remediation, or release automation
