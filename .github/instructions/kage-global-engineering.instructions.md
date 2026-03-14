---
name: kage-global-engineering
description: Shared engineering rules for repo-wide changes, artifacts, and stage handoffs.
---

# Global Engineering Rules

## Scope

Apply these rules to any task that changes code, configuration, documentation, templates, or workflow files in this repository.

## Non-Negotiable Rules

- Treat this file as the shared engineering baseline for all modes.
- Keep changes focused on the requested outcome.
- Prefer editing existing files over introducing new structure unless the new structure is part of the task.
- Keep repository content in English.
- Keep the conversation language aligned with the user's chosen locale.
- Ask clarifying questions when ambiguity affects architecture, scope, safety, or validation.

## Generated Files

- Never manually edit `dist/` or `coverage/` outputs.
- Never manually edit generated `pika.gen.*` files.
- If a task changes generation logic or upstream inputs for generated files, update the source of generation and describe the required regeneration step.
- If a task affects core generation scripts such as `generate:csstype` or `generate:property-effects`, treat regeneration as part of the validation plan.

## Dependency Awareness

- Assume upstream package changes can invalidate downstream type consumption and runtime behavior.
- Rebuild upstream packages with `pnpm --filter @pikacss/<package> build` when their public output is consumed downstream.
- Use `.github/instructions/kage-impact-routing.instructions.md` as the only authoritative dependency fan-out reference.

## Safe Command Policy

- Prefer package-scoped commands during iterative development.
- Use root-level validation only when the task truly spans multiple packages or is in final verification.
- Do not use root-level `pnpm build` as a normal development loop.
- Prefer repo scripts over ad hoc commands whenever a package script already exists.

## Task Artifact Contract

- When durable task outputs are needed, store them under `.ai/tasks/<task-id>/`.
- Use stable artifact names such as `spec.md`, `plan.md`, `review.md`, `test-delta.md`, `docs-checklist.md`, `workstream-map.md`, `merge-summary.md`, `doctor-report.md`, and `notes.md`.
- Keep artifacts additive and task-specific. Do not turn shared instruction files into task history logs.
- If a stage consumes an earlier artifact, preserve the original intent and record any scope changes explicitly instead of silently overwriting them.

## Shared Workstream Model

- Use `split` when one task contains multiple scope slices, decision areas, or dependency branches that are clearer as separate workstreams.
- Use `continue` when a later stage resumes one existing workstream without reopening the whole parent task.
- Use `merge` only when prerequisite workstreams are complete enough to recombine into one downstream handoff.
- Keep workstream status explicit with values such as `proposed`, `approved`, `in-progress`, `blocked`, `ready-for-merge`, `merged`, and `deferred`.
- Preserve the parent objective and shared acceptance criteria across split work unless a deliberate scope change is recorded.
- Use `workstream-map.md` to track split state and `merge-summary.md` to capture recombined scope, validation, and residual risks.

## Shared Handoff Schema

Use this schema whenever one stage hands work to another stage:

- `objective`: the immediate goal of the next stage
- `accepted_scope`: what is explicitly in scope
- `out_of_scope`: what must not be changed in the next stage
- `impacted_areas`: packages, docs, demo, or workflow files that matter
- `dependencies`: upstream or downstream relationships that affect execution order
- `acceptance_criteria`: the conditions that define success
- `required_validation`: commands or checks the next stage must run or preserve
- `artifacts`: the task files that already exist or must be updated next
- `open_questions`: unresolved issues that must stay visible
- `handoff_notes`: concise context the next stage should not rediscover

When workstreams are involved, also preserve:

- `parent_objective`: the top-level goal shared by split work
- `workstream_id`: the specific slice being continued or reviewed
- `merge_preconditions`: the conditions that must be true before recombination

## Example Handoff Payload

```md
## Handoff

- objective: Add a new core hook without changing current plugin defaults.
- accepted_scope: `packages/core`, impacted integration types, and matching tests.
- out_of_scope: docs IA changes, unrelated plugin cleanup, release work.
- impacted_areas: `packages/core`, `packages/integration`, `.ai/tasks/<task-id>/`.
- dependencies: `core -> integration -> unplugin`.
- acceptance_criteria: new hook is typed, tested, and does not regress existing plugin behavior.
- required_validation: core test/typecheck, core build if downstream public output changes, integration validation if types fan out.
- artifacts: `spec.md`, `plan.md`, `impact-matrix.md`.
- open_questions: whether the hook should be public in the first release.
- handoff_notes: preserve existing plugin hook naming conventions.
```

## Clarification Triggers

- The requested behavior conflicts with current public behavior.
- The scope could reasonably land in multiple packages or layers.
- The user intent would change the validation matrix.
- The task changes public API, generated assets, or docs behavior but the expected outcome is not explicit.
