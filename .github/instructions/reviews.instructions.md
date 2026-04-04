# Review Instructions

- Lead with findings, not praise, summary, or general reassurance.
- Use direct language. Do not soften a real defect into a suggestion.
- Every blocking review finding must state:
  - what is wrong
  - the evidence
  - why it matters
  - why the proposed fix direction is correct
- Prioritize correctness, regressions, policy bypasses, test gaps, schema drift, boundary violations, unsafe automation, release risk, and auditability loss.
- Treat weak tests as a real defect when they hide failure source or fail to prove the intended behavior.
- Reject changes that hide logic in decorators, weaken strictness, skip required artifacts, or move privileged behavior outside policy and observability paths.
- If no defects are found, state residual risks and what the review did not prove.
