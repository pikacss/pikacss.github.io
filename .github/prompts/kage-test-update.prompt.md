---
name: kage-test-update
description: Add or update tests for changed behavior and record the coverage delta.
argument-hint: What changed behavior needs test coverage?
agent: kage-test-update
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [implementation](../instructions/kage-implementation.instructions.md), [testing](../instructions/kage-testing.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Test Update Prompt

## When To Use

Use this prompt when behavior changed or coverage needs to be added, updated, or justified.

## Required Inputs

- the approved spec
- the changed behavior
- current test coverage context

## Required Outputs

- added tests
- updated tests
- intentionally untested cases
- a test delta artifact
- a handoff block for review

## Required Checks

- use the repo's canonical package-scoped validation paths
- describe skipped verification honestly
- align coverage with the actual changed behavior, not just touched files

## Handoff Target

Hand off to `/kage-review` or back to `/kage-implement` if the missing coverage reveals design issues.

## Example Output Format

```md
## Test Delta

- added_tests:
	- selector prefix parsing accepts valid prefixes
- updated_tests:
	- config defaults remain unchanged when the option is absent
- intentionally_untested_cases:
	- none
- validation_commands:
	- `pnpm --filter @pikacss/core test`

## Handoff

- objective: Review updated coverage for correctness and gaps.
- accepted_scope: core tests for the new config option.
- out_of_scope: integration smoke tests.
- impacted_areas: `packages/core/src/*.test.ts`
- dependencies: none
- acceptance_criteria: changed behavior is covered and existing behavior stays protected.
- required_validation: preserve listed test command results.
- artifacts: `test-delta.md`
- open_questions: none
- handoff_notes: add integration coverage later only if the option fans out.
```
