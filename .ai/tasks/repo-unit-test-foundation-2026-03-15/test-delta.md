# Test Delta

## Artifact Metadata

- Task ID: `repo-unit-test-foundation-2026-03-15`
- Status: `ready-for-merge`
- Owner: `GitHub Copilot`
- Last Updated: `2026-03-15`

## Workstream

- Current Workstream: `merge-ready final rollout`

## Added Tests

- `packages/core/src/internal/atomic-style.test.ts`
- `packages/core/src/internal/engine.test.ts`
- `packages/core/src/internal/extractor.test.ts`
- `packages/core/src/internal/plugin.test.ts`
- `packages/core/src/internal/property-effects.test.ts`
- `packages/core/src/internal/resolver.test.ts`
- `packages/core/src/internal/utils.test.ts`
- `packages/core/src/internal/plugins/important.test.ts`
- `packages/core/src/internal/plugins/keyframes.test.ts`
- `packages/core/src/internal/plugins/selectors.test.ts`
- `packages/core/src/internal/plugins/shortcuts.test.ts`
- `packages/core/src/internal/plugins/variables.branches.test.ts`
- `packages/core/src/internal/plugins/variables.test.ts`
- `packages/integration/src/ctx.test.ts`
- `packages/integration/src/ctx.branches.test.ts`
- `packages/integration/src/eventHook.test.ts`
- `packages/integration/src/tsCodegen.test.ts`
- `packages/unplugin/src/index.test.ts`
- `packages/nuxt/src/index.test.ts`
- `packages/plugin-fonts/src/providers.test.ts`
- `packages/plugin-fonts/src/index.test.ts`
- `packages/plugin-icons/src/index.test.ts`
- `packages/plugin-reset/src/index.test.ts`
- `packages/plugin-typography/src/index.test.ts`
- `packages/eslint-config/src/index.test.ts`
- `packages/eslint-config/src/utils/fn-names.test.ts`
- `packages/eslint-config/src/rules/no-dynamic-args.test.ts`

## Updated Tests

- `packages/nuxt/src/index.test.ts`
- `packages/core/src/internal/engine.test.ts`
- `packages/core/src/internal/plugins/keyframes.test.ts`
- `packages/core/src/internal/plugins/selectors.test.ts`
- `packages/core/src/internal/plugins/shortcuts.test.ts`
- `packages/integration/src/ctx.test.ts`
- `packages/eslint-config/src/rules/no-dynamic-args.test.ts`
- `packages/plugin-fonts/src/index.test.ts`
- `packages/plugin-icons/src/index.test.ts`
- `packages/plugin-reset/src/index.test.ts`
- `packages/plugin-typography/src/index.test.ts`
- `packages/unplugin/src/index.test.ts`

## Intentionally Untested Cases

- Files listed as approved exceptions in `notes.md` remain intentionally untested at the dedicated file level because they are pure barrels, type-only surfaces, generated artifacts, or content-only modules.
- Representative examples include `packages/core/src/index.ts`, `packages/integration/src/index.ts`, `packages/unplugin/src/types.ts`, `packages/plugin-reset/src/resets/*.ts`, `packages/plugin-typography/src/styles.ts`, and `packages/eslint-config/src/rules/index.ts`.

## Validation Commands

- `pnpm --filter @pikacss/core test`
- `pnpm --filter @pikacss/core typecheck`
- `pnpm --filter @pikacss/integration test`
- `pnpm --filter @pikacss/integration typecheck`
- `pnpm --filter @pikacss/unplugin-pikacss test`
- `pnpm --filter @pikacss/unplugin-pikacss typecheck`
- `pnpm --filter @pikacss/nuxt-pikacss test`
- `pnpm --filter @pikacss/nuxt-pikacss typecheck`
- `pnpm --filter @pikacss/plugin-fonts test`
- `pnpm --filter @pikacss/plugin-fonts typecheck`
- `pnpm --filter @pikacss/plugin-icons test`
- `pnpm --filter @pikacss/plugin-icons typecheck`
- `pnpm --filter @pikacss/plugin-reset test`
- `pnpm --filter @pikacss/plugin-reset typecheck`
- `pnpm --filter @pikacss/plugin-typography test`
- `pnpm --filter @pikacss/plugin-typography typecheck`
- `pnpm --filter @pikacss/eslint-config test`
- `pnpm --filter @pikacss/eslint-config typecheck`
- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`

## Notes

- Added the first co-located unit tests for every in-scope runtime file listed in the baseline ledger across `core`, `integration`, `unplugin`, `nuxt`, `plugin-*`, and `eslint-config`.
- The final test update pass also stabilized repo-wide verification by fixing the Nuxt hoisted mock setup and rewriting test string literals that triggered `no-template-curly-in-string` during root-level lint.
- This follow-up test update adds coverage for core resolver recursion and rule normalization, engine layer fallback plus default-preflight wrapping, formatted string preflight rendering, formatted object preflight rendering, object preflight null-sanitization, invalid-selector/null-value atomic-style drop branches, keyframes string/object config plus unused-prune filtering, selector and shortcut invalid-config fallthrough branches, variables helper recursion plus semantic/pruning branches, integration config discovery/scaffolding/fallback plus scan/codegen/setup-failure, ts-codegen no-op, malformed scanner recovery, mixed malformed-then-valid scan continuation branches, normal/force-string/force-array plus preview transform output branches, unplugin config-change reload setup in `rspack` mode plus Vite/Farm adapter side effects, webpack/esbuild wiring, setup caching, and unchanged-config no-op watch branches, icon local-loader plus CDN fallback/failure paths with `auto -> bg` rendering, explicit `bg` mode processor branches, VS Code environment local-loader skip branches, plugin-fonts provider/family/font-face branches, plugin-reset unknown-style skip behavior, plugin-typography default-config branches, selector/keyframes/shortcut autocomplete payload branches, and both the Vue template visitor registration path plus parser-backed Vue template violations through direct AST execution, real `.vue` ESLint traversal, Vue object/spread/computed-key lint coverage, Vue array traversal coverage, top-level spread argument coverage, plus additional binary/logical/member/call diagnostic branch coverage in `no-dynamic-args`.
- The latest root-level coverage pass raised overall statement coverage from `76.30%` to `92.79%`, with overall branch coverage at `83.53%`, `engine.ts` at `81.94%` branch coverage, `ctx.ts` at `75.83%` branch coverage, `no-dynamic-args.ts` at `86.66%` branch coverage, `unplugin/src/index.ts` at `82.05%` branch coverage, `plugin-fonts/src/index.ts` at `81.94%` branch coverage, and `plugin-icons/src/index.ts` at `82.53%` branch coverage.
- The repo is still below the aspirational `95%` threshold because the remaining low-coverage surfaces are now concentrated in larger unresolved runtime modules such as `eslint-config/src/rules/no-dynamic-args.ts`, `integration/src/ctx.ts`, and `core/src/internal/engine.ts`, plus approved content-only exception files that remain intentionally untested.
- The follow-up package-scoped validations for `@pikacss/core`, `@pikacss/integration`, and `@pikacss/eslint-config` passed, and root-level `pnpm test`, `pnpm typecheck`, and `pnpm lint` were rerun successfully after these test updates.
- The completed rollout preserves approved exceptions for barrels, type-only surfaces, generated artifacts, and content-only modules.

## Handoff

- Objective: Review and merge the completed repo-wide unit test baseline rollout.
- Accepted Scope: all completed workstreams under `.ai/tasks/repo-unit-test-foundation-2026-03-15/` plus the added co-located test files across packages.
- Out Of Scope: new feature work, generated-file edits, broad CI redesign, or unrelated cleanup.
- Impacted Areas: `packages/core`, `packages/integration`, `packages/unplugin`, `packages/nuxt`, `packages/plugin-*`, `packages/eslint-config`, and the task artifacts under `.ai/tasks/repo-unit-test-foundation-2026-03-15/`.
- Dependencies: all split workstreams are complete; merge readiness depends on review rather than additional implementation sequencing.
- Acceptance Criteria: every in-scope runtime module from the baseline ledger is now either paired with a co-located test or preserved as an approved exception.
- Required Validation: preserve the package-scoped test and typecheck results already run for each completed slice, plus the completed root-level `pnpm test`, `pnpm typecheck`, and `pnpm lint` final verification.
- Artifacts: `spec.md`, `plan.md`, `workstream-map.md`, `notes.md`, `test-delta.md`, `merge-summary.md`.
- Open Questions: none.
- Handoff Notes: use `merge-summary.md` as the review entry point, preserve the approved exception ledger, and treat the package-scoped checkpoints plus completed root-level verification as the canonical validation record.
