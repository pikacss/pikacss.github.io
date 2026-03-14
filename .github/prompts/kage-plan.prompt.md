---
name: kage-plan
description: Turn an approved spec into an execution plan with validation and implementation handoff.
argument-hint: Which approved spec should be planned?
agent: kage-plan
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [planning](../instructions/kage-planning.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md), [testing](../instructions/kage-testing.instructions.md)

# Plan Prompt

## When To Use

Use this prompt to turn an approved spec into an execution plan.

## Required Inputs

- the approved spec
- impacted areas
- constraints and tradeoffs

## Required Outputs

- ordered steps
- dependency ordering
- validation plan
- expected test updates
- expected docs updates
- explicit out-of-scope boundaries
- a handoff block for implementation
- a `workstream-map.md` artifact when execution must be split into multiple dependency-aware workstreams
- a `merge-summary.md` artifact when completed workstreams are ready to recombine

## Required Checks

- choose one recommended implementation path
- account for downstream validation using the impact-routing rules
- identify any unresolved risks before implementation starts
- split only when one plan would otherwise hide dependency order, parallelism, or merge risk

## Handoff Target

Hand off to `/kage-implement` once the plan is accepted. When the plan is split, hand off the next workstream plus explicit merge preconditions.

## Example Output Format

```md
## Plan

- ordered_steps:
	1. Update the core config type and parsing path.
	2. Add or adjust co-located tests.
	3. Rebuild core only if downstream public output changes.
	4. Validate integration if the emitted types changed.
- dependency_ordering:
	- `packages/core` before `packages/integration`
- validation_plan:
	- `pnpm --filter @pikacss/core test`
	- `pnpm --filter @pikacss/core typecheck`
- expected_test_updates:
	- config parsing tests in core
- expected_docs_updates:
	- docs only if the option is public
- out_of_scope:
	- demo redesign

## Handoff

- objective: Implement the approved plan without expanding scope.
- accepted_scope: core config path, core tests, downstream integration validation when needed.
- out_of_scope: docs translation and release notes.
- impacted_areas: `packages/core`, optional `packages/integration`.
- dependencies: `core -> integration`.
- acceptance_criteria: new option behaves as specified and validation passes.
- required_validation: core test/typecheck, plus downstream checks if public output changes.
- artifacts: `spec.md`, `plan.md`, `impact-matrix.md`
- open_questions: none
- handoff_notes: keep defaults backward compatible.
```
