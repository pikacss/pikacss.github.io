# Plan

## Artifact Metadata

- Task ID:
- Status:
- Owner:
- Last Updated:

## Goal

## Assumptions

## Ordered Steps

## Dependencies

## Validation

## Test Updates

## Docs Updates

## Exclusions

## Handoff

- Objective:
- Accepted Scope:
- Out Of Scope:
- Impacted Areas:
- Dependencies:
- Acceptance Criteria:
- Required Validation:
- Artifacts:
- Open Questions:
- Handoff Notes:

## Example

```md
## Handoff

- Objective: Implement the approved plan without expanding scope.
- Accepted Scope: core config parser, tests, and downstream validation if needed.
- Out Of Scope: release tasks and unrelated cleanup.
- Impacted Areas: `packages/core`, optional `packages/integration`.
- Dependencies: `core -> integration`.
- Acceptance Criteria: behavior matches spec and planned validation passes.
- Required Validation: core test/typecheck, downstream validation when output fans out.
- Artifacts: `spec.md`, `plan.md`, `impact-matrix.md`
- Open Questions: none
- Handoff Notes: keep the option backward compatible.
```
