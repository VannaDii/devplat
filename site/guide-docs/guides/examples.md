# Examples

## Spec to Slice to PR to Merge

1. `create_research_brief` captures the problem statement and evidence.
2. `create_spec_record` converts it into an auditable spec artifact.
3. `create_slice_plan` and `evaluate_slice_plan_readiness` break the work into implementation units.
4. Queue and task tools track claim, update, and status transitions.
5. GitHub and branching tools create pull-request records, update status, and plan dependent rebases.
6. Policy, Discord approvals, and gates decide whether the work can merge.

## Incident Remediation

1. `create_review_finding`
2. `create_remediation_plan`
3. `run_gates`
4. `evaluate_sonar_quality_gate`
