---
name: kage-implementation-rules
description: Implementation rules for focused changes, adjacency updates, validation, and review handoff.
---

# Implementation Rules

## Scope

Use these rules when making code, config, documentation, or workflow changes.

## Change Discipline

- Prefer the smallest coherent change set that solves the requested problem.
- Preserve existing style and public APIs unless the request requires an API change.
- Avoid unrelated cleanup while implementing the requested work.

## Adjacency Rules

- If public behavior changes, update tests or explicitly justify why the current tests already cover it.
- If public API, user-facing behavior, or workflow behavior changes, update docs or explicitly justify why no docs change is required.
- If a package change affects docs or demo behavior, include those updates in the implementation plan instead of treating them as optional follow-up.

## Validation Before Handoff

- Run the smallest credible package-scoped validation for the changed area.
- If the change touches an upstream package, rebuild it before validating downstream consumers.
- If the change affects generated outputs, validate the source change and document the regeneration requirement.

## Implementation Handoff Requirements

Before handing work to review, test update, docs update, or the user, include:

- a concise summary of what changed
- the files or areas changed
- the validation that was run
- the checks that were intentionally skipped
- the artifacts that were created or updated
- any follow-up that remains mandatory for correctness

## Example Implementation Summary

```md
## Implementation Summary

- changed_areas: `packages/core/src`, `packages/core/src/*.test.ts`, `.ai/tasks/<task-id>/plan.md`
- summary: Added the new hook to the engine pipeline and updated the existing hook tests.
- validation_run: `pnpm --filter @pikacss/core test`, `pnpm --filter @pikacss/core typecheck`
- skipped_checks: integration validation pending because public output did not change
- artifacts_updated: `plan.md`, `impact-matrix.md`
- follow_up_required: docs update if the hook becomes public API
```

## Out-of-Scope Discipline

- Do not expand the task into adjacent improvements unless they are required to keep the requested change correct.
- If you discover follow-up work, record it as a separate note instead of silently expanding the implementation.
