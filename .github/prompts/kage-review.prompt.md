---
name: kage-review
description: Review a change set with findings-first output and explicit follow-up recommendations.
argument-hint: What change set or task output should be reviewed?
agent: kage-review
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [review](../instructions/kage-review.instructions.md), [testing](../instructions/kage-testing.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md), [documentation](../instructions/kage-documentation.instructions.md)

# Review Prompt

## When To Use

Use this prompt after implementation or when reviewing an existing change set.

## Required Inputs

- the changed files or artifact set
- the approved spec and plan when available
- the validation summary

## Required Outputs

- findings first
- any residual risks or unverified areas
- a short summary only after the findings
- a clear handoff recommendation

## Required Checks

- prioritize bugs, regressions, missing tests, docs drift, and skipped downstream checks
- verify the implementation stayed within scope
- verify generated-file rules were respected

## Handoff Target

Hand off to the user, or back to `/kage-implement`, `/kage-test-update`, or `/kage-docs-update` when follow-up work is required.

## Example Output Format

```md
## Findings

1. medium — Docs impact is unresolved even though the new option appears user-facing.
	Why it matters: merge would ship behavior without matching guidance.
	Follow-up: run `/kage-docs-update` or mark the option internal-only.

## Residual Risks

- Full downstream validation was not run because public type fan-out is still being confirmed.

## Handoff Recommendation

- next_stage: `/kage-docs-update`
- reason: user-facing guidance is incomplete
```
