# Spec

## Artifact Metadata

- Task ID: `repo-unit-test-foundation-2026-03-15`
- Status: `approved`
- Owner: `GitHub Copilot`
- Last Updated: `2026-03-15`

## Request

Establish a repo-wide unit test foundation for hand-written source files under `packages/*/src` so test files are co-located with their source files, generated outputs are excluded, and the standard explicitly rejects happy-path-only coverage.

## Accepted Scope

- Define the approved repository baseline for unit tests covering hand-written source files under `packages/*/src`.
- Define the pairing rule for co-located test files alongside the source modules they verify.
- Define explicit exclusion rules for generated files and generated-output directories, including `pika.gen.*`, `dist/`, and `coverage/`.
- Define the minimum coverage expectation for touched behavior, including failure paths, invalid inputs, edge conditions, and regression-sensitive branches.
- Define the approved exception rule for pure barrel or re-export-only modules that do not contain behavior.
- Define the remediation objective and planning boundary for bringing the existing repository up to the approved baseline.
- Preserve package-scoped validation and downstream verification rules that later implementation work must follow.

## Out Of Scope

- Writing or updating the actual unit tests in this stage.
- Refactoring production code solely to make tests easier to add unless a later implementation plan proves it is necessary.
- Changing generated files or generated-file workflows.
- Defining repo-wide coverage percentages or enforcing a specific coverage tool threshold in this stage.
- Expanding the task into docs-site, demo, release, or CI redesign unless later planning shows that test policy adoption requires a narrow workflow update.
- Requiring one-to-one test pairing for pure barrel or re-export-only modules.
- Adding integration, end-to-end, or visual regression standards beyond what is required to support the unit-test baseline.

## Requirements

1. The standard must apply to hand-written modules under `packages/*/src` across the monorepo.
2. Test files must be co-located with the source files they validate and follow the repository's existing per-package testing model.
3. Generated files and generated-output directories must be excluded from pairing and remediation scope.
4. The standard must explicitly reject happy-path-only tests as insufficient.
5. For touched behavior, unit tests must cover relevant failure paths, invalid inputs, edge conditions, and regression-sensitive branches when those behaviors exist.
6. Pure barrel or re-export-only modules may be treated as approved exceptions and do not require a dedicated test file when their behavior is already covered through the underlying logic modules.
7. The spec must support a later remediation plan for existing gaps without forcing immediate repo-wide implementation in this stage.
8. The spec must preserve package-scoped validation as the canonical development path and must not rely on root-level `vitest --project` filtering.
9. Any later implementation must respect dependency fan-out when changes touch upstream packages such as `core`, `integration`, or `unplugin`.

## Acceptance Criteria

- The approved baseline clearly identifies what must have co-located unit tests and what is excluded.
- The approved baseline clearly states that happy-path-only coverage is insufficient.
- The approved baseline defines the allowed exception for pure barrel or re-export-only modules.
- The approved baseline is specific enough for `/kage-plan` to produce an ordered remediation plan without reopening scope discovery.
- The approved baseline preserves the repository's package-scoped validation model and downstream verification routing.
- No unresolved ambiguity remains about the initial scope, exclusion rules, or exception rules.

## Impacted Packages Or Areas

- `packages/core/src`
- `packages/integration/src`
- `packages/unplugin/src`
- `packages/nuxt/src`
- `packages/plugin-fonts/src`
- `packages/plugin-icons/src`
- `packages/plugin-reset/src`
- `packages/plugin-typography/src`
- `packages/eslint-config/src`
- package-local test conventions and Vitest usage across `packages/*`
- `.ai/tasks/repo-unit-test-foundation-2026-03-15/spec.md`

## Dependencies

- Repository package graph: `core -> integration -> unplugin -> nuxt`
- Plugin packages depend on `core`
- Later remediation planning must preserve upstream-to-downstream validation order when public behavior or public outputs are touched
- Validation must follow package-scoped commands rather than root-level Vitest project filtering

## Assumptions

- Co-located pairing means the test file lives beside the source module in the same package source area, using the repository's existing `*.test.ts` convention.
- The immediate deliverable is the approved spec, not implementation.
- Existing repository guidance in `AGENTS.md` already supports the quality direction that happy-path-only coverage is incomplete.
- The remediation plan can be phased later if repo-wide rollout is too large for one implementation pass.
- Excluding generated files includes generated source artifacts such as `pika.gen.*` and generated output folders such as `dist/` and `coverage/`.

## Open Questions

- none

## Handoff

- Objective: Convert this approved unit-test baseline into an ordered remediation plan for the repository.
- Accepted Scope: Repo-wide unit-test policy and remediation planning for hand-written modules under `packages/*/src`, including co-located pairing rules, exclusion rules, and non-happy-path expectations.
- Out Of Scope: Immediate test implementation, CI redesign, generated-file edits, docs/demo rewrites, and mandatory one-to-one tests for pure barrel modules.
- Impacted Areas: `packages/*/src`, package-local Vitest validation flows, and `.ai/tasks/repo-unit-test-foundation-2026-03-15/spec.md`.
- Dependencies: `core -> integration -> unplugin -> nuxt`; `plugin-* -> core`; package-scoped validation remains canonical; downstream checks must follow impact routing when upstream public surfaces are touched.
- Acceptance Criteria: The next stage can produce a phased plan that identifies baseline rules, exceptions, remediation ordering, and required validation without rediscovering scope.
- Required Validation: Preserve canonical package-scoped validation (`pnpm --filter @pikacss/<package> test`, `pnpm --filter @pikacss/<package> typecheck`), rebuild upstream packages before downstream validation when public outputs change, and avoid root `vitest --project` filtering as a planning assumption.
- Artifacts: `spec.md`; `plan.md` expected next if planning proceeds.
- Open Questions: none.
- Handoff Notes: Keep the implementation path minimal, exclude generated artifacts from remediation, treat barrel-only modules as explicit exceptions, and plan for failure-path and edge-case coverage rather than only happy-path assertions.
