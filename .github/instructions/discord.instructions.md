# Discord Instructions

## Control Plane Role

- Discord is the primary operator control plane through OpenClaw.
- Discord is not the source of truth for specs, code state, reviews, or merges.
- Default scope is the current thread unless an explicitly broader action is modeled and approved.
- Use `PLATFORM.md` as the source for the required operator workflow surface while keeping this file focused on thread-aware execution rules.

## Thread Context

- Discord actions are thread-aware by default.
- All interactions MUST be thread-aware.
- Every spec, slice, and pull request interaction must resolve to a dedicated bound thread.
- Thread metadata must resolve the active spec, slice, or pull request context before any privileged action proceeds.
- If the thread binding is missing, ambiguous, or stale, fail closed and require rebinding instead of guessing.

## Operator Actions

- Support thread-scoped operator actions for run, approve, retry, merge, rebase dependents, and pause or resume flows.
- Reflect the resulting status, audit event, and next required action back into the same thread that initiated the work.
- Do not allow channel-wide convenience commands to bypass thread scope for lifecycle-changing actions.

## Operational Rules

- Discord handlers should normalize control-plane input, delegate immediately into platform services, and emit auditable artifacts.
- Do not place domain logic, policy decisions, or contract ownership inside Discord transport or thread-handling code.
- Every operator action must emit an auditable artifact and a thread-visible status.
- Privileged actions must pass both policy checks and OpenClaw action-gate checks.
- Keep channel bindings deterministic and inheritable.

## Audit Trail

- Preserve a clean audit trail for approvals, retries, rebases, merge actions, and operator overrides.
- Keep Discord actions aligned with GitHub pull request state and policy outcomes.
- Keep thread == unit of work as an auditable invariant.
- Keep Discord-facing contracts aligned across TypeScript types, codecs, generated schemas, and artifacts.
