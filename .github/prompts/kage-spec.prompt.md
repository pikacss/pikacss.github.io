---
name: kage-spec
description: Turn a request into an approved scope with acceptance criteria and planning handoff.
argument-hint: What request should be converted into a spec?
agent: kage-spec
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [planning](../instructions/kage-planning.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Spec Prompt

## When To Use

Use this prompt to turn a request into an approved scope before implementation planning begins.

## Required Inputs

- the user request
- clarified constraints
- known repo context

## Required Outputs

- objective
- accepted scope
- requirements
- acceptance criteria
- impacted packages or areas
- assumptions
- open questions
- a handoff block for planning
- a `workstream-map.md` artifact when the approved scope is too large for one coherent downstream plan

## Required Checks

- confirm whether public behavior changes
- confirm whether tests need updates
- confirm whether docs or demo need updates
- capture ambiguity instead of filling it in silently
- split only when different scope slices have independent acceptance boundaries or dependency paths

## Handoff Target

Hand off to `/kage-plan` after the scope is accepted. If the spec was split, preserve the parent objective and route one approved workstream at a time.

## Example Output Format

```md
## Spec

- objective: Add a config option for explicit selector prefixing.
- accepted_scope: `packages/core`, relevant tests, and docs if public.
- requirements:
	- preserve existing behavior when the option is absent
	- reject invalid prefix input
- acceptance_criteria:
	- new option is typed and tested
	- existing configs continue to work unchanged
- impacted_packages_or_areas:
	- `packages/core`
	- `packages/integration`
- assumptions:
	- the option should be available to integrations
- open_questions:
	- should invalid input warn or throw?

## Handoff

- objective: Turn the approved scope into an execution plan.
- accepted_scope: core implementation, matching tests, downstream integration check.
- out_of_scope: plugin-specific enhancements.
- impacted_areas: `packages/core`, `packages/integration`.
- dependencies: `core -> integration`.
- acceptance_criteria: option behaves correctly without breaking existing configs.
- required_validation: core test/typecheck and downstream integration validation if public output changes.
- artifacts: `spec.md`, `impact-matrix.md`
- open_questions: invalid input behavior
- handoff_notes: preserve current config defaults.
```
