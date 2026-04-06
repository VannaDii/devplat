# Schema Instructions

## Source of Truth

- Export TypeScript types as the schema source of truth.
- Keep `io-ts` codecs aligned with those types through exactness assertions.
- Regenerate committed JSON Schemas whenever a public contract changes.
- Do not hand-edit generated schema files.

## Lifecycle Expectations

- If a public contract changes, update the corresponding tests, docs, and operator-facing explanations in the same change.
- Keep schema and manifest generation aligned with the research, spec, slicing, review, and release workflow surfaces that consume them.
- A passing build is not sufficient if committed schemas drift from generated output.
