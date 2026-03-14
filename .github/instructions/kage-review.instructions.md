---
name: kage-review-rules
description: Findings-first review rules for bugs, regressions, verification gaps, and docs drift.
---

# Review Rules

## Scope

Use these rules when reviewing code, plans, workflow files, tests, or docs updates.

## Review Mindset

- Lead with findings, not summaries.
- Prioritize bugs, regressions, unsafe assumptions, missing tests, and docs drift.
- Treat missing downstream verification as a review concern, not a minor detail.

## Findings Format

Each review should include:

- severity
- concrete issue
- affected file or area
- why it matters
- what follow-up is needed

Use severity labels consistently:

- `high`: likely bug, regression, or unsafe release blocker
- `medium`: correctness, maintainability, or verification gap that should be fixed before merge
- `low`: minor risk, clarity issue, or follow-up item

## Common Risk Checks

- Behavior changed without matching tests.
- Public API changed without matching docs.
- Upstream package changed without downstream verification.
- Generated-file workflow changed without documenting regeneration.
- The implementation drifted beyond the approved scope.
- Split workstreams were merged without checking cross-workstream risks or merge preconditions.
- One workstream was reviewed in isolation even though merge-ready scope introduced combined behavior changes.

## Workstream Review Guidance

- When reviewing one workstream, state clearly whether the findings apply only to that slice or also block future merge.
- When reviewing merged work, report both per-workstream findings and cross-workstream integration risks.
- Treat missing merge validation as a review concern when combined scope changes runtime behavior, types, docs, or release readiness.
- Preserve unresolved workstream blockers in the final review output instead of collapsing them into generic follow-up text.

## Residual Risk Reporting

- If no findings are present, say so explicitly.
- When no findings are present, still mention residual risks or unverified areas.
- Keep summaries short and secondary to findings.

## Example Review Output

```md
## Findings

1. high — Downstream validation for `@pikacss/unplugin-pikacss` is missing after the integration-facing type change.
	Why it matters: integration types fan out to framework consumers and can break generated output behavior.
	Follow-up: run unplugin validation or justify why the changed types cannot propagate.

## Residual Risks

- Full repo `pnpm test` was not run at this checkpoint.

## Summary

- One blocking verification gap remains.
```
