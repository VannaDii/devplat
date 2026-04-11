---
'@vannadii/devplat-config': minor
'@vannadii/devplat-discord': minor
'@vannadii/devplat-openclaw': minor
---

Align the Discord control-plane contracts with explicit v10 runtime
configuration and thread-scoped operator behavior.

This change adds Discord v10 connection and install settings to the runtime and
OpenClaw plugin configuration, expands Discord thread and control contracts to
stay fully thread-aware, and updates the generated schemas, manifest, and guide
documentation to match the current operator workflow and CI expectations.
