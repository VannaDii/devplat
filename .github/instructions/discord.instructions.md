# Discord Instructions

- Discord actions are thread-aware by default.
- Every operator action must emit an auditable artifact and a thread-visible status.
- Privileged actions must pass both policy checks and OpenClaw action-gate checks.
- Keep channel bindings deterministic and inheritable.
