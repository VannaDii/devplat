# Architecture Instructions

- Keep package boundaries explicit and stable.
- Standard decorators are allowed only for registration, routing, capability tags, and transport metadata.
- Decorated methods must delegate immediately into pure logic or services.
- `@vannadii/devplat-openclaw` remains adapter-only.
- `@vannadii/devplat-discord` is the primary human control surface.
- `@vannadii/devplat-storage` is the only package allowed to touch `.devplat/` directly.
- Prefer additive contract evolution over breaking changes to artifact and tool surfaces.
- Keep privileged decisions observable and policy-mediated.
