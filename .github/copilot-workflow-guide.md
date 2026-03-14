# Kage Workflow Guide

This guide explains the custom Copilot workflow available in this repository.

All workflow entry points in this guide use the `kage-` namespace so they do not collide with generic prompts, agents, or instructions from other environments.

The current rollout keeps file paths stable where practical, but the user-facing command names, agent names, and instruction identifiers are namespaced for portability.

Use it when you need to decide which slash command or agent should handle a task.

## Core Model

The workflow is organized around two layers:

- slash commands in `.github/prompts/` for direct user entry points
- custom agents in `.github/agents/` for persistent roles and native handoff buttons

The default delivery path is:

`/kage-clarify` -> `/kage-spec` -> `/kage-plan` -> `/kage-implement` -> `/kage-review`

Supporting stages branch from implementation or review when needed:

- `/kage-test-update`
- `/kage-docs-update`

Task-oriented entry points are also available:

- `/kage-release`
- `/kage-docs-only`
- `/kage-package-maintenance`
- `/kage-doctor`

## Slash Command Map

| Slash command | Agent | Use when | Typical output | Native handoff targets |
|---|---|---|---|---|
| `/kage-clarify` | `kage-clarify` | ambiguity blocks safe planning or implementation | blocking questions, safe defaults, next stage | `kage-spec`, `kage-plan` |
| `/kage-spec` | `kage-spec` | a request needs approved scope and acceptance criteria | approved scope, requirements, handoff | `kage-plan` |
| `/kage-plan` | `kage-plan` | an approved spec needs execution steps | ordered plan, validation scope, handoff | `kage-implement` |
| `/kage-implement` | `kage-implement` | approved work should be executed | implementation summary, validation, handoff | `kage-test-update`, `kage-docs-update`, `kage-review` |
| `/kage-test-update` | `kage-test-update` | behavior changed and coverage needs to be added or updated | test delta, validation, handoff | `kage-review` |
| `/kage-docs-update` | `kage-docs-update` | user-facing behavior or guidance changed | docs checklist, validation, handoff | `kage-review` |
| `/kage-review` | `kage-review` | a delivered change set needs findings-first review | findings, residual risks, next step | `kage-implement`, `kage-test-update`, `kage-docs-update` |
| `/kage-release` | `kage-release` | release readiness, versioning, or publish preparation is needed | release summary, blockers, next step | `kage-review`, `kage-docs-update` |
| `/kage-docs-only` | `kage-docs-only` | docs-only or demo-only work should stay isolated from product implementation | docs-only summary, validation, next step | `kage-docs-update`, `kage-review` |
| `/kage-package-maintenance` | `kage-package-maintenance` | package scaffolding, package hygiene, or package-level maintenance is needed | package maintenance summary, downstream impact, next step | `kage-implement`, `kage-review` |
| `/kage-doctor` | `kage-doctor` | an existing repository needs workflow adoption, health auditing, or foundation gap analysis | doctor report, workstream map, next stage | `kage-clarify`, `kage-spec`, `kage-plan`, `kage-package-maintenance` |

## Stage Guidance

### Clarify

Start here when the request leaves multiple valid interpretations that would change scope, validation, or public behavior.

### Spec

Use this stage to freeze the approved scope before planning begins.

### Plan

Use this stage to define ordered implementation steps, dependencies, and validation.

### Implement

Use this stage to execute approved work, run focused validation, and hand off cleanly.

### Test Update

Use this stage when the implementation is mostly correct but coverage is missing or too weak.

### Docs Update

Use this stage when implementation is correct but user-facing guidance, docs, or demo content still lags.

### Review

Use this stage to identify bugs, regressions, missing validation, and docs drift. Review can route back into implementation, tests, or docs.

## Task-Oriented Entry Points

### Release

Use for release readiness and package publishing preparation. This stage follows the root release scripts instead of inventing an ad hoc process.

### Docs-Only

Use when the work should stay on docs or demo surfaces and should not expand into product implementation unless docs drift reveals a real bug.

### Package Maintenance

Use for scaffolding, dependency hygiene, package metadata maintenance, or package-level refactoring that should stay aligned with existing monorepo scripts.

### Doctor

Use for onboarding Kage into an existing repository, auditing workflow health, or turning missing workflow foundations into durable remediation artifacts.

## Handoff Pattern

Most native agent handoffs use this structure:

- `Continue from ...`
- `Preserve: ...`
- `Focus: ...`

Treat `Preserve` as the contract that must survive the next stage.
Treat `Focus` as the only work the receiving stage should perform next.

## Large Work Handling

When a request becomes too large for one coherent clarify, spec, or plan pass, use Kage workstreams:

- `split`: break the parent objective into workstreams with their own scope, dependencies, and next stages
- `continue`: resume one workstream without reopening the entire parent task
- `merge`: recombine completed workstreams into one downstream handoff when merge preconditions are satisfied

Use `workstream-map.md` to track split state and `merge-summary.md` to capture merged scope, validation, and cross-workstream risks.

## Suggested Defaults

- If you are unsure where to start, use `/kage-clarify`.
- If scope is already agreed, start with `/kage-spec` or `/kage-plan`.
- If code changes are already approved, use `/kage-implement`.
- If the work is docs-only, use `/kage-docs-only`.
- If the work is release-oriented, use `/kage-release`.
- If the work is package hygiene or scaffolding, use `/kage-package-maintenance`.
- If the repository needs Kage onboarding or workflow-health auditing, use `/kage-doctor`.
