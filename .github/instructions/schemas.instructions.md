# Schema Instructions

- Export TypeScript types as the schema source of truth.
- Keep `io-ts` codecs aligned with those types through exactness assertions.
- Regenerate committed JSON Schemas whenever a public contract changes.
- Do not hand-edit generated schema files.
- If a public contract changes, update the corresponding tests in the same change.
- A passing build is not sufficient if committed schemas drift from generated output.
