---
name: kage-clarify
description: Clarify ambiguous requirements before planning or implementation.
argument-hint: What ambiguity or decision point needs to be resolved?
agent: kage-clarify
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [planning](../instructions/kage-planning.instructions.md)

# Clarify Prompt

## When To Use

Use this prompt when ambiguity affects architecture, scope, validation, public behavior, or acceptance criteria.

## Required Inputs

- the user request
- known constraints
- current assumptions
- the decision points that block safe progress

## Required Outputs

- a short list of the blocking ambiguities
- the exact questions required to remove them
- a recommended default only when it is safe to offer one
- the proposed handoff target after clarification
- a `workstream-map.md` artifact when ambiguity clusters into separate decision areas

## Required Checks

- confirm whether the ambiguity changes package scope
- confirm whether the ambiguity changes test or docs requirements
- avoid guessing through unresolved behavior
- split into workstreams only when different ambiguity clusters can progress independently

## Handoff Target

Hand off to `/kage-spec` or `/kage-plan` once the blocking ambiguities are resolved. When the scope is too large for one clarification pass, hand off with `workstream-map.md` so later stages can continue one slice at a time.

## Example Output Format

```md
## Clarification Needed

- ambiguity: The request does not say whether the new option is public API or internal-only.
- why_it_blocks: This changes docs scope, naming constraints, and required downstream validation.
- question: Should the option be exposed to end users in the first version?
- safe_default: Treat it as internal-only until approved otherwise.
- handoff_target: `/kage-spec`
```
