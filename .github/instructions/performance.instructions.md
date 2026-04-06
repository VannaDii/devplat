# Performance Instructions

## Performance Standards

- Keep workflow-heavy packages deterministic, bounded, and explicit about expensive work.
- Prefer incremental and additive updates over repeated full-repository scans in request or tool-execution paths.
- Reuse generated artifacts and cached state where correctness permits.

## Hot Paths

- Treat research, specs, slicing, queue orchestration, review, remediation, supervisor cycles, and OpenClaw tool execution as hot paths.
- Batch filesystem, GitHub, and SonarCloud work instead of issuing repetitive single-item operations.
- Keep Discord and OpenClaw operator flows responsive by delegating heavy work to platform services rather than adapters.

## Benchmark Policy

- Add a measurable benchmark, timing note, or bounded-complexity explanation when changing a hot path.
- Call out expected performance impact in pull requests when a change touches repository-wide scans, long-running loops, or release automation.
