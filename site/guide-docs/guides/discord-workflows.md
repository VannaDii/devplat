# Discord Workflows

## Thread-Based Execution

- Open a Discord thread for the work item
- Bind the thread to the platform record
- Route implementation updates and audit events through the thread binding

## Approval Flow

- Create an approval record artifact
- Evaluate privileged actions through the policy package
- Persist the decision path and resulting audit log

## Operational Pattern

1. Research creates a brief.
2. Specs turn that brief into an approvable record.
3. Slicing produces small dependency-aware tasks.
4. Queue and supervisor coordinate execution.
5. Discord approvals unblock merges or retries with explicit traceability.
