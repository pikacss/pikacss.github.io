# Baseline Ledger

## Artifact Metadata

- Task ID: `repo-unit-test-foundation-2026-03-15`
- Workstream ID: `ws-a-baseline-ledger`
- Status: `ready-for-merge`
- Owner: `GitHub Copilot`
- Last Updated: `2026-03-15`

## Objective

Establish the executable baseline ledger for repo-wide unit test remediation by classifying hand-written modules under `packages/*/src` as test-required, approved-exception, or out-of-scope-generated, and by sequencing the next implementation slice without writing tests in this workstream.

## Scope Applied

- Included: hand-written `*.ts` modules under `packages/*/src`.
- Excluded: generated artifacts such as `pika.gen.*`, `dist/`, `coverage/`, and generated source files.
- Exception rule applied: pure barrel or re-export-only modules do not require dedicated tests.
- Conservative rule applied: when a file contains meaningful runtime logic, it stays in the remediation backlog even if it also exports types.

## Repository Baseline Summary

- Co-located `*.test.ts` pairings currently present under `packages/core/src`: added for all `ws-b-core` runtime files listed below.
- Co-located `*.test.ts` pairings currently present under `packages/integration/src`, `packages/unplugin/src`, `packages/nuxt/src`, `packages/plugin-*`, and `packages/eslint-config/src`: added for all completed workstream targets except approved exceptions.
- Generated source exclusions confirmed: `packages/core/src/csstype.ts`, `packages/core/src/internal/generated-shorthand-map.ts`, `packages/core/src/internal/generated-property-semantics.ts`.
- Pure barrel exceptions confirmed: `packages/core/src/index.ts`, `packages/core/src/internal/types/index.ts`, `packages/integration/src/index.ts`, `packages/eslint-config/src/rules/index.ts`.
- Data-content exceptions confirmed: `packages/core/src/internal/constants.ts`, `packages/plugin-reset/src/resets/andy-bell.ts`, `packages/plugin-reset/src/resets/eric-meyer.ts`, `packages/plugin-reset/src/resets/modern-normalize.ts`, `packages/plugin-reset/src/resets/normalize.ts`, `packages/plugin-reset/src/resets/the-new-css-reset.ts`, `packages/plugin-typography/src/styles.ts`.

## Remediation Backlog

### Requires Paired Test

#### core

- `packages/core/src/internal/atomic-style.ts`
- `packages/core/src/internal/engine.ts`
- `packages/core/src/internal/extractor.ts`
- `packages/core/src/internal/plugin.ts`
- `packages/core/src/internal/property-effects.ts`
- `packages/core/src/internal/utils.ts`
- `packages/core/src/internal/plugins/important.ts`
- `packages/core/src/internal/plugins/keyframes.ts`
- `packages/core/src/internal/plugins/selectors.ts`
- `packages/core/src/internal/plugins/shortcuts.ts`
- `packages/core/src/internal/plugins/variables.ts`

#### integration

- `packages/integration/src/ctx.ts`
- `packages/integration/src/eventHook.ts`
- `packages/integration/src/tsCodegen.ts`

#### unplugin

- `packages/unplugin/src/index.ts`

#### nuxt

- `packages/nuxt/src/index.ts`

#### eslint-config

- `packages/eslint-config/src/index.ts`
- `packages/eslint-config/src/rules/no-dynamic-args.ts`
- `packages/eslint-config/src/utils/fn-names.ts`

#### plugin-fonts

- `packages/plugin-fonts/src/index.ts`
- `packages/plugin-fonts/src/providers.ts`

#### plugin-icons

- `packages/plugin-icons/src/index.ts`

#### plugin-reset

- `packages/plugin-reset/src/index.ts`

#### plugin-typography

- `packages/plugin-typography/src/index.ts`

## Approved Exceptions

### Pure Type Surface

These files are treated as approved exceptions for unit-test pairing because they currently expose type declarations without independent runtime behavior.

- `packages/core/src/types.ts`
- `packages/core/src/internal/types/autocomplete.ts`
- `packages/core/src/internal/types/engine.ts`
- `packages/core/src/internal/types/preflight.ts`
- `packages/core/src/internal/types/resolved.ts`
- `packages/core/src/internal/types/shared.ts`
- `packages/core/src/internal/types/utils.ts`
- `packages/integration/src/types.ts`
- `packages/unplugin/src/types.ts`

### Thin Adapter Surface

These files are treated as approved exceptions for dedicated file-level tests in the baseline ledger because they are thin framework wrappers around shared factory behavior already slated for testing in upstream runtime modules.

- `packages/unplugin/src/esbuild.ts`
- `packages/unplugin/src/rolldown.ts`
- `packages/unplugin/src/rollup.ts`
- `packages/unplugin/src/rspack.ts`
- `packages/unplugin/src/vite.ts`
- `packages/unplugin/src/webpack.ts`

### Generated Or Content-Only Surface

- `packages/core/src/csstype.ts`
- `packages/core/src/internal/generated-property-semantics.ts`
- `packages/core/src/internal/generated-shorthand-map.ts`
- `packages/core/src/internal/constants.ts`
- `packages/plugin-reset/src/resets/andy-bell.ts`
- `packages/plugin-reset/src/resets/eric-meyer.ts`
- `packages/plugin-reset/src/resets/modern-normalize.ts`
- `packages/plugin-reset/src/resets/normalize.ts`
- `packages/plugin-reset/src/resets/the-new-css-reset.ts`
- `packages/plugin-typography/src/styles.ts`

### Barrel Or Re-Export Surface

- `packages/core/src/index.ts`
- `packages/core/src/internal/types/index.ts`
- `packages/integration/src/index.ts`
- `packages/eslint-config/src/rules/index.ts`

## Package Summary

| package | requires-paired-test | approved-exception | out-of-scope-generated | notes |
| --- | ---: | ---: | ---: | --- |
| `core` | 0 remaining in `ws-b-core` | 10 | 3 | Runtime backlog covered by new co-located tests; ready for downstream slices. |
| `integration` | 0 remaining in `ws-c-core-chain-consumers` | 2 | 0 | `ctx.ts`, `eventHook.ts`, and `tsCodegen.ts` now have co-located tests. |
| `unplugin` | 0 remaining in `ws-c-core-chain-consumers` | 7 | 0 | Factory behavior now covered; thin adapters remain approved exceptions. |
| `nuxt` | 0 remaining in `ws-c-core-chain-consumers` | 0 | 0 | Module wiring now covered by a co-located test. |
| `eslint-config` | 0 remaining in `ws-e-support-packages` | 1 | 0 | Config factory, rule logic, and helper utilities now have co-located tests. |
| `plugin-fonts` | 0 remaining in `ws-d-plugins` | 0 | 0 | Provider URL logic and plugin registration now covered by co-located tests. |
| `plugin-icons` | 0 remaining in `ws-d-plugins` | 0 | 0 | Main runtime surface now covered by a co-located test. |
| `plugin-reset` | 0 remaining in `ws-d-plugins` | 5 | 0 | Entry behavior now covered; preset data files remain approved exceptions. |
| `plugin-typography` | 0 remaining in `ws-d-plugins` | 1 | 0 | Entry behavior now covered; data-only `styles.ts` remains excepted. |

## Implementation Checklist For Later Workstreams

- Add co-located `*.test.ts` only for files listed under `requires-paired-test`.
- Preserve approved exceptions unless production logic changes enough to invalidate the rationale.
- For touched behavior, add failure-path, invalid-input, edge-case, and regression-sensitive assertions.
- Do not add tests for generated or content-only artifacts.
- When upstream public behavior changes, rebuild and validate downstream packages in the approved dependency order.
- Record any newly discovered exception as an explicit artifact update instead of silently skipping the file.

## Next Recommended Slice

- none
- Reason: all approved workstreams are complete and ready for merge review.

## Handoff

- Objective: Start `ws-b-core` using this ledger as the baseline contract for which `core` files need paired tests and which files remain approved exceptions.
- Accepted Scope: Artifact-backed baseline inventory, exception ledger, and remediation backlog for hand-written modules under `packages/*/src`.
- Out Of Scope: Writing or updating tests in this workstream, production refactors, generated-file edits, and CI/docs redesign.
- Impacted Areas: `.ai/tasks/repo-unit-test-foundation-2026-03-15/notes.md`, `.ai/tasks/repo-unit-test-foundation-2026-03-15/test-delta.md`, `.ai/tasks/repo-unit-test-foundation-2026-03-15/workstream-map.md`.
- Dependencies: none for `ws-a`; downstream execution order remains `core -> integration -> unplugin -> nuxt` and `plugin-* -> core`.
- Acceptance Criteria: Every in-scope module is classified as test-required or approved-exception, and the next workstream can begin without rediscovering the repository baseline.
- Required Validation: Artifact consistency only in this workstream; later code workstreams must use package-scoped test/typecheck and required downstream validation.
- Artifacts: `spec.md`, `plan.md`, `workstream-map.md`, `notes.md`, `test-delta.md`.
- Open Questions: none.
- Handoff Notes: Keep the ledger authoritative for exception handling, and treat absence of current co-located tests as a remediation starting point rather than a reason to broaden scope.
