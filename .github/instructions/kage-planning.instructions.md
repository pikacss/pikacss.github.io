---
name: kage-planning-rules
description: Planning and specification rules for discovery, ambiguity handling, and implementation handoff.
---

# Planning Rules

## Scope

Use these rules when turning a request into a spec, plan, or execution strategy.

## Discovery Workflow

- Start by identifying the user goal, impacted area, and the smallest credible implementation path.
- Check whether the request touches upstream packages, generated-file workflows, docs, or demo surfaces.
- Separate confirmed requirements from assumptions.

## Ambiguity Threshold

- Do not plan past unresolved ambiguity that could change architecture, public behavior, or acceptance criteria.
- If multiple valid paths exist, surface the decision point before committing to one.
- Record open questions explicitly instead of silently filling gaps.

## Plan Output Requirements

Every plan should state:

- objective
- accepted scope
- out-of-scope boundaries
- impacted packages or areas
- ordered implementation steps
- dependency ordering
- required validation
- expected test and docs updates
- excluded work

When the scope is too large for one coherent plan, the plan should also state:

- the split reason
- the workstream list
- per-workstream dependency ordering
- merge preconditions
- which workstreams can proceed in parallel

Plans should also include a reusable handoff block that matches the shared schema from `kage-global-engineering.instructions.md`.

## Split Triggers

- Split when one task spans multiple packages or surfaces with independently testable acceptance criteria.
- Split when ambiguity is clustered into separate decision areas instead of blocking the whole request equally.
- Split when one plan would otherwise hide dependency order, parallelism, or risk.
- Split when different slices clearly route to different next stages, such as docs, product implementation, package maintenance, or workflow bootstrap.
- Do not split if the work still has one clear acceptance boundary and one validation path.

## Workstream Planning

- Record split work in `workstream-map.md` under `.ai/tasks/<task-id>/`.
- Give each workstream a stable ID, accepted scope, out-of-scope boundary, dependencies, owning next stage, and required validation.
- Keep merge readiness explicit so later stages know when a combined implementation or review is safe.
- Use `merge-summary.md` only when enough workstreams are complete to recombine into one downstream handoff.

## Handoff Contract

Before handing off to implementation, ensure the plan includes:

- a single recommended path
- any user-approved tradeoffs
- the downstream verification scope
- unresolved questions, if any remain
- the artifact path under `.ai/tasks/<task-id>/` when task outputs are being persisted

If the plan was split into workstreams, also ensure it includes:

- which workstream should proceed next
- which workstreams are blocked or deferred
- what must be true before merge

## Example Plan Handoff

```md
## Handoff

- objective: Implement the approved behavior with the smallest coherent change set.
- accepted_scope: `packages/integration` config loading and its co-located tests.
- out_of_scope: new user-facing config options, docs rewrite, demo redesign.
- impacted_areas: `packages/integration`, `packages/unplugin`, `.ai/tasks/<task-id>/plan.md`.
- dependencies: `integration -> unplugin`.
- acceptance_criteria: config loading behavior matches the approved spec and existing call sites remain valid.
- required_validation: integration test/typecheck, downstream unplugin validation if generated output changes.
- artifacts: `spec.md`, `plan.md`, `impact-matrix.md`.
- open_questions: none.
- handoff_notes: preserve current config file resolution priority.
```
