---
name: kage-docs-only
description: Handle docs-only or demo-only work without treating it as a general implementation task.
argument-hint: What docs-only change or docs-site task should be handled?
agent: kage-docs-only
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [documentation](../instructions/kage-documentation.instructions.md), [testing](../instructions/kage-testing.instructions.md)

# Docs-Only Prompt

## When To Use

Use this prompt for docs-only changes, docs-site maintenance, or demo-facing guidance work that should stay isolated from product implementation.

## Required Inputs

- the docs objective
- affected pages or demo surfaces
- any known behavior constraints

## Required Outputs

- affected docs surfaces
- validation run or proposed
- translation impact
- remaining docs debt
- next handoff target

## Required Checks

- use docs package scripts as the source of truth
- keep docs-only work isolated unless product drift is discovered
- record demo and translation impact explicitly

## Handoff Target

Hand off to `/kage-docs-update` for content work or `/kage-review` for final review.

## Example Output Format

```md
## Docs-Only Summary

- affected_surfaces:
	- `docs/index.md`
	- `docs/guide/installation.md`
- validation_run:
	- `pnpm --filter @pikacss/docs typecheck`
- translation_impact: yes
- remaining_docs_debt:
	- zh-TW mirror update still pending
- next_handoff_target: `/kage-review`
```
