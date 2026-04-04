# OpenClaw Instructions

- OpenClaw is the transport adapter, not the business logic layer.
- Tool handlers should validate input, delegate, and format structured results.
- Keep plugin config and tool schemas generated from real types.
- Do not bypass policy or observability when exposing privileged actions.
