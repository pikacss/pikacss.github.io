# Plan

## Artifact Metadata

- Task ID: `repo-unit-test-foundation-2026-03-15`
- Status: `approved`
- Owner: `GitHub Copilot`
- Last Updated: `2026-03-15`

## Goal

Turn the approved repo-wide unit test baseline into an implementation-ready remediation plan that can be executed in phased work without reopening scope, while preserving co-located test pairing, generated-artifact exclusions, barrel-module exceptions, package-scoped validation, and dependency-aware downstream checks.

## Assumptions

- The approved spec remains the source of truth for scope, exclusions, and exception rules.
- This stage plans execution only and does not add or rewrite test files.
- Co-located pairing uses the repository's existing `*.test.ts` convention beside the source file under `packages/*/src`.
- Generated inputs and outputs remain outside remediation scope, including `pika.gen.*`, `dist/`, and `coverage/`.
- Pure barrel or re-export-only modules remain explicit exceptions unless later implementation finds behavioral code in those files.
- The repository is large enough that remediation should be phased rather than attempted as one monolithic change set.

## Split Reason

The repository-wide remediation spans multiple packages with independent validation boundaries and dependency fan-out. Splitting by package slice preserves execution order, makes validation explicit, and avoids hiding downstream risk behind a single oversized implementation batch.

## Recommended Path

Use a phased remediation strategy with one policy/baseline workstream followed by implementation workstreams ordered by dependency fan-out:

1. Establish the executable baseline inventory and exception ledger.
2. Remediate the core dependency chain in order: `core -> integration -> unplugin -> nuxt`.
3. Remediate plugin packages after core-chain expectations are stable.
4. Handle repository edge packages such as `eslint-config` last if they remain in scope after inventory confirms hand-written source coverage needs.
5. Merge the workstreams only after each slice reaches baseline compliance and required validation has been recorded.

## Ordered Steps

1. Inventory scope and classify modules.
   - Enumerate hand-written modules under `packages/*/src`.
   - Mark each module as `requires-paired-test`, `approved-exception`, or `out-of-scope-generated`.
   - Record barrel/re-export-only exceptions explicitly so later implementation does not reinterpret them ad hoc.

2. Produce the remediation ledger and sequence.
   - Translate the inventory into a package-by-package backlog of missing pairings and weak happy-path-only coverage.
   - Prioritize packages by dependency order so upstream packages stabilize before downstream consumers are updated.
   - Identify packages that can proceed in parallel after the core chain is complete.

3. Implement workstream A: baseline inventory and exception enforcement.
   - Create or update task artifacts that list covered modules, approved exceptions, and deferred items.
   - Define the implementation checklist each package workstream must satisfy before merge.
   - Keep this workstream documentation-focused and avoid writing tests here.

4. Implement workstream B: `@pikacss/core` remediation.
   - Add or upgrade co-located unit tests for hand-written `packages/core/src` modules that lack compliant coverage.
   - Prefer small test boundaries around pure logic, parser, extractor, optimizer, and plugin-hook behavior.
   - Ensure touched tests include non-happy-path assertions where behavior supports them.
   - Rebuild `@pikacss/core` before validating downstream packages if public output changes.

5. Implement workstream C: `@pikacss/integration`, then `@pikacss/unplugin-pikacss`, then `@pikacss/nuxt`.
   - Remediate `integration` first because it depends on `core` behavior and types.
   - Remediate `unplugin` after `integration` because generated integration-facing behavior can fan out there.
   - Remediate `nuxt` last in the core chain because it depends on `unplugin` behavior.
   - Run downstream verification at each step when upstream public behavior or public outputs change.

6. Implement workstream D: plugin packages.
   - Remediate `plugin-fonts`, `plugin-icons`, `plugin-reset`, and `plugin-typography` after core-chain behavior is stable.
   - Focus on plugin-specific transforms, invalid inputs, edge conditions, and compatibility assumptions against `core`.
   - Validate the changed plugin package and `core` compatibility assumptions when plugin behavior depends on shared hooks.

7. Implement workstream E: remaining in-scope support packages.
   - Confirm whether `packages/eslint-config/src` contains hand-written runtime or rule logic that truly belongs under this baseline.
   - If yes, remediate it with co-located tests following the same pairing and coverage standard.
   - If no meaningful unit boundary exists, record the reason as an explicit exception rather than stretching the scope.

8. Merge and close.
   - Reconcile the remediation ledger with implemented changes.
   - Confirm every in-scope module is either paired with a compliant test or listed as an approved exception.
   - Preserve a clear record of any deferred follow-up that remains outside the approved scope.

## Workstreams

- `ws-a-baseline-ledger`
  - Scope: Inventory, classification, approved exceptions, and remediation tracking artifacts.
  - Dependency: none.
  - Parallelism: must complete before implementation workstreams merge; may overlap early discovery for later slices.

- `ws-b-core`
  - Scope: `packages/core/src` pairing and non-happy-path coverage remediation.
  - Dependency: `ws-a-baseline-ledger`.
  - Parallelism: should start first among code workstreams.

- `ws-c-core-chain-consumers`
  - Scope: `packages/integration/src`, `packages/unplugin/src`, `packages/nuxt/src`.
  - Dependency: `ws-b-core` for stable upstream behavior and any required rebuild output.
  - Parallelism: `integration` before `unplugin`, `unplugin` before `nuxt`.

- `ws-d-plugins`
  - Scope: `packages/plugin-fonts/src`, `packages/plugin-icons/src`, `packages/plugin-reset/src`, `packages/plugin-typography/src`.
  - Dependency: `ws-b-core`.
  - Parallelism: plugin packages may proceed in parallel after core expectations are stable.

- `ws-e-support-packages`
  - Scope: `packages/eslint-config/src` if inventory confirms meaningful in-scope unit boundaries.
  - Dependency: `ws-a-baseline-ledger`.
  - Parallelism: can proceed independently once classification is complete.

## Dependencies

- Preserve the approved repository dependency order: `core -> integration -> unplugin -> nuxt`.
- Treat `plugin-* -> core` as the governing dependency rule for plugin remediation.
- Rebuild upstream packages before downstream validation when public outputs change.
- Preserve package-scoped validation as canonical and do not plan around root `vitest --project` filtering.

## Validation

- Planning-stage validation: artifact correctness only; no package tests are executed in this stage.
- Implementation-stage required validation per changed package:
  - `pnpm --filter @pikacss/<package> test`
  - `pnpm --filter @pikacss/<package> typecheck`
- Additional required downstream validation when upstream public surfaces change:
  - `core` changes: rebuild `@pikacss/core`, then validate `@pikacss/integration` and `@pikacss/unplugin-pikacss`, plus `@pikacss/nuxt` when affected.
  - `integration` changes: validate `@pikacss/integration`, `@pikacss/unplugin-pikacss`, and `@pikacss/nuxt` when affected.
  - `unplugin` changes: validate `@pikacss/unplugin-pikacss` and downstream framework consumers when affected.
  - Plugin changes: validate the changed plugin package and `@pikacss/core` compatibility assumptions when relevant.
- Explicit constraint: do not use root-level `pnpm vitest run --project <name>` as the planned validation path.

## Test Updates

- Expected in later implementation, not in this stage.
- Each implementation workstream should add or strengthen co-located `*.test.ts` coverage only for hand-written in-scope modules.
- Test updates must include negative and edge-case assertions where behavior supports them; happy-path-only additions are not acceptable.

## Docs Updates

- No docs update is required for this planning stage.
- If later implementation changes any user-facing testing guidance or workflow conventions outside task artifacts, plan a separate docs update rather than expanding this execution plan implicitly.

## Exclusions

- No test implementation in this stage.
- No production refactors unless later implementation proves they are required for correctness.
- No generated-file edits.
- No repo-wide CI or release workflow redesign.
- No docs/demo redesign as part of this plan.
- No mandatory dedicated tests for pure barrel or re-export-only modules.

## Handoff

- Objective: Implement the approved phased remediation plan without expanding scope beyond the repo-wide unit test baseline.
- Accepted Scope: Repo-wide unit-test policy rollout and remediation for hand-written modules under `packages/*/src`, including co-located pairing, generated-artifact exclusions, barrel exceptions, and non-happy-path coverage expectations.
- Out Of Scope: Immediate CI redesign, generated-file edits, docs/demo rewrites, release work, and mandatory one-to-one tests for pure barrel modules.
- Impacted Areas: `packages/core/src`, `packages/integration/src`, `packages/unplugin/src`, `packages/nuxt/src`, `packages/plugin-fonts/src`, `packages/plugin-icons/src`, `packages/plugin-reset/src`, `packages/plugin-typography/src`, `packages/eslint-config/src` if inventory confirms scope, and `.ai/tasks/repo-unit-test-foundation-2026-03-15/` artifacts.
- Dependencies: `core -> integration -> unplugin -> nuxt`; `plugin-* -> core`; package-scoped validation remains canonical; upstream rebuilds are required before downstream validation when public outputs change.
- Acceptance Criteria: Every in-scope hand-written module is either paired with a compliant co-located test or recorded as an approved exception, and each implementation slice preserves required validation and non-happy-path coverage expectations.
- Required Validation: `pnpm --filter @pikacss/<package> test`; `pnpm --filter @pikacss/<package> typecheck`; upstream package build before downstream validation when public outputs change; no root `vitest --project` filtering.
- Artifacts: `spec.md`, `plan.md`, `workstream-map.md`, and later implementation tracking artifacts as needed.
- Open Questions: none.
- Handoff Notes: Start with the baseline ledger, execute the core chain before downstream consumers, allow plugin work after core stabilizes, and record explicit exceptions instead of silently skipping modules.
