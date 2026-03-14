---
name: kage-release
description: Prepare or assess release readiness using the repository's release workflow.
argument-hint: What release task or release-readiness check should be performed?
agent: kage-release
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [testing](../instructions/kage-testing.instructions.md), [documentation](../instructions/kage-documentation.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Release Prompt

## When To Use

Use this prompt for release readiness, release validation, versioning preparation, or package publishing preparation.

## Required Inputs

- the release objective
- affected packages or release surfaces
- known blockers or open questions

## Required Outputs

- release intent
- commands run or proposed
- skipped checks and why
- blockers
- next handoff target

## Required Checks

- use the repository release scripts as the source of truth
- distinguish release-only validation from iterative development validation
- call out docs or packaging work that still blocks release

## Handoff Target

Hand off to `/kage-review` or `/kage-docs-update` when release blockers remain.

## Example Output Format

```md
## Release Summary

- release_intent: prepare package publish for the next monorepo version
- commands_run:
	- `pnpm typecheck`
	- `pnpm publint`
- skipped_checks:
	- `pnpm release` not run because docs updates are still pending
- blockers:
	- docs update required before version bump
- next_handoff_target: `/kage-docs-update`
```
