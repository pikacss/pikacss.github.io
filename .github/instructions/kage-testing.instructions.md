---
name: kage-testing-and-verification
description: Canonical validation paths, downstream verification rules, and verification report format.
---

# Testing And Verification Rules

## Scope

Use these rules whenever a task changes code, config, generated-file inputs, docs examples that execute, or package integration behavior.

## Canonical Verification Paths

- Use `pnpm --filter @pikacss/<package> test` for package-scoped test validation.
- Use `pnpm --filter @pikacss/<package> typecheck` for package-scoped type validation.
- Use `pnpm --filter @pikacss/<package> build` only when an upstream package must publish fresh public output for downstream consumers.
- Use `pnpm --filter @pikacss/docs typecheck` for docs validation.
- Use `pnpm --dir demo build` or `pnpm --dir demo type-check` when demo behavior must be validated.
- Use root `pnpm test`, `pnpm typecheck`, and `pnpm lint` only for broad or final verification.

## Important Repo Constraint

- Do not treat root-level `pnpm vitest run --project <name>` as the canonical package validation path in this repository.
- Prefer package-scoped `pnpm --filter ...` commands or the package-local script directly.

## Minimum Verification Matrix

- Code change inside one package: run package `test` and `typecheck`.
- Upstream package change: rebuild the upstream package, then validate required downstream consumers.
- Docs-only change: run docs `typecheck`; run docs build when routing, content generation, or site behavior changed.
- Demo-visible change: run demo `build` or `type-check` as appropriate.
- Workflow or repo-rule change: run the narrowest validation that proves the new guidance matches repo reality.

## Downstream Verification Rules

- Use `.github/instructions/kage-impact-routing.instructions.md` to determine required downstream checks.
- If `core` changes, validate the required downstream packages and any affected docs or demo flows.
- If `integration` changes, validate `unplugin` and any consumers of generated outputs.
- If `unplugin` changes, validate framework-facing behavior plus affected docs or demo flows.

## Reporting Requirements

- State exactly which commands were run.
- State which expected checks were not run.
- Give a concrete reason for each skipped check.

## Verification Report Schema

Every verification-oriented handoff should include:

- `validation_run`
- `validation_passed`
- `skipped_checks`
- `downstream_checks`
- `known_gaps`

## Example Verification Report

```md
## Verification Report

- validation_run:
	- `pnpm --filter @pikacss/integration test`
	- `pnpm --filter @pikacss/integration typecheck`
- validation_passed: yes
- skipped_checks:
	- `pnpm --filter @pikacss/unplugin-pikacss test` not run because no public integration output changed
- downstream_checks:
	- none required beyond integration for this change
- known_gaps:
	- full repo verification not run at this checkpoint
```
