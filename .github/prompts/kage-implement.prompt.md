---
name: kage-implement
description: Execute an approved spec and plan, then hand off with validation context.
argument-hint: Which approved plan should be implemented?
agent: kage-implement
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [implementation](../instructions/kage-implementation.instructions.md), [testing](../instructions/kage-testing.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md), [documentation](../instructions/kage-documentation.instructions.md)

# Implement Prompt

## When To Use

Use this prompt to execute an approved spec and plan.

## Required Inputs

- the approved spec
- the approved plan
- impacted packages or areas
- required verification scope

## Required Outputs

- the code, config, docs, or workflow changes
- the validation summary
- the task artifacts updated under `.ai/tasks/<task-id>/` when persistence is in scope
- a handoff block for review or follow-up stages

## Required Checks

- keep the implementation within the approved scope
- update tests when behavior changes, or justify why existing coverage is sufficient
- update docs or demo guidance when public behavior changes, or justify why not
- run the smallest credible validation before handoff

## Handoff Target

Hand off to `/kage-review`, and also to `/kage-test-update` or `/kage-docs-update` when those stages are still pending.

## Example Output Format

```md
## Implementation Summary

- changed_areas:
	- `packages/core/src/config.ts`
	- `packages/core/src/config.test.ts`
- validation_summary:
	- `pnpm --filter @pikacss/core test`
	- `pnpm --filter @pikacss/core typecheck`
- skipped_checks:
	- integration validation deferred because exported public types did not change
- artifacts_updated:
	- `plan.md`
	- `impact-matrix.md`

## Handoff

- objective: Review the implementation for correctness and missing follow-up.
- accepted_scope: core config change and matching tests.
- out_of_scope: docs changes unless the option becomes public.
- impacted_areas: `packages/core`.
- dependencies: none beyond optional downstream validation.
- acceptance_criteria: config behavior matches spec and tests pass.
- required_validation: preserve the listed core validation results.
- artifacts: `spec.md`, `plan.md`, `impact-matrix.md`
- open_questions: none
- handoff_notes: confirm whether docs are needed before merge.
```
