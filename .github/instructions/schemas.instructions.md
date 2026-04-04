# Schema Instructions

- Export TypeScript types as the schema source of truth.
- Keep `io-ts` codecs aligned with those types through exactness assertions.
- Regenerate committed JSON Schemas whenever a public contract changes.
- Do not hand-edit generated schema files.
