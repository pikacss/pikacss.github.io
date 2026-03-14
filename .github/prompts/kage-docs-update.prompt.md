---
name: kage-docs-update
description: Update user-facing docs or demo guidance and record the docs checklist.
argument-hint: What user-facing behavior or guidance changed?
agent: kage-docs-update
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [documentation](../instructions/kage-documentation.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Docs Update Prompt

## When To Use

Use this prompt when public behavior, setup, API usage, or user-facing guidance changed.

## Required Inputs

- the approved spec
- the user-facing behavior change
- affected docs or demo surfaces

## Required Outputs

- updated docs or demo guidance
- a docs checklist artifact
- any remaining docs debt that should be tracked separately
- a handoff block for review

## Required Checks

- keep docs guidance aligned with actual scripts and package behavior
- update demo-facing guidance when the change is visible there
- respect translation and localized-example boundaries

## Handoff Target

Hand off to `/kage-review` after docs-facing work is complete.

## Example Output Format

```md
## Docs Update

- updated_surfaces:
	- `docs/getting-started/installation.md`
	- `docs/index.md`
- demo_guidance_updated: no
- remaining_docs_debt:
	- zh-TW mirror update pending after English review
- validation_run:
	- `pnpm --filter @pikacss/docs typecheck`

## Handoff

- objective: Review docs-facing changes for completeness and correctness.
- accepted_scope: English docs updates for the new user-facing option.
- out_of_scope: localized translation rollout.
- impacted_areas: `docs/`
- dependencies: English docs approval before translation follow-up.
- acceptance_criteria: user-facing guidance matches the implemented behavior.
- required_validation: preserve docs typecheck result.
- artifacts: `docs-checklist.md`
- open_questions: none
- handoff_notes: translation impact is intentionally deferred.
```
