# Discord Workflows

## Control Plane Model

- Discord is the primary operator control plane through OpenClaw.
- GitHub remains the source of truth for specs, code state, reviews, and merges.
- Discord threads should expose lifecycle progress and approvals, not replace GitHub state.
- Discord transport and thread code should delegate into platform services rather than own business logic or contract normalization.
- `PLATFORM.md` defines the required operator workflow surface. This guide describes how to keep that surface thread-aware and auditable.

## Thread-Based Execution

- open a Discord thread for the work item
- bind the thread to the platform record
- route implementation updates, audit events, approvals, retries, and rebase notices through the thread binding
- require every lifecycle-changing action to resolve its context from thread metadata
- fail closed when a command is issued without a valid thread binding

## Operator Actions

- `run this`: execute work in the active thread context
- `approve this`: approve the bound spec, slice, or pull request state
- `retry`: re-run failed gates or remediation in the bound thread context
- `merge`: trigger the merge path for the bound pull request context
- `rebase dependents`: trigger branching coordination for the bound context
- `pause` or `resume`: change execution state without leaving the bound thread

## Approval Flow

- create an approval record artifact
- evaluate privileged actions through the policy package and OpenClaw action gates
- persist the decision path and resulting audit log
- reflect the resulting state back into GitHub and operator-visible thread updates
- keep Discord-facing approval contracts aligned with codecs, generated schemas, and auditable artifacts

## Operational Pattern

1. Research creates a brief.
2. Specs turn that brief into an approvable record and spec PR.
3. Slicing produces dependency-aware implementation units.
4. Queue and supervisor coordinate execution.
5. Discord approvals unblock merges or retries with explicit traceability.

## Guarantees

- every action is auditable
- no context leakage between threads
- thread == unit of work
