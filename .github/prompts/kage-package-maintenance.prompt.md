---
name: kage-package-maintenance
description: Handle package scaffolding, package hygiene, or package-level maintenance using repository workflows.
argument-hint: What package maintenance task should be handled?
agent: kage-package-maintenance
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [implementation](../instructions/kage-implementation.instructions.md), [testing](../instructions/kage-testing.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Package Maintenance Prompt

## When To Use

Use this prompt for package scaffolding, package metadata maintenance, dependency hygiene, or package-level maintenance work.

## Required Inputs

- the package maintenance goal
- affected packages
- any downstream concerns

## Required Outputs

- affected packages
- commands run or proposed
- downstream impact
- remaining risks
- next handoff target

## Required Checks

- use existing scaffolding and maintenance scripts where applicable
- preserve package-scoped validation and downstream checks
- avoid inventing parallel maintenance workflows

## Handoff Target

Hand off to `/kage-implement` for execution or `/kage-review` for final review.

## Example Output Format

```md
## Package Maintenance Summary

- affected_packages:
	- `@pikacss/core`
	- `@pikacss/integration`
- commands_run:
	- `pnpm --filter @pikacss/core typecheck`
- downstream_impact:
	- integration validation required if exported types change
- remaining_risks:
	- package metadata updates still need review
- next_handoff_target: `/kage-review`
```
