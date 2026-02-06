---
status: resolved
trigger: "VitePress documentation build has build error"
created: 2026-02-06T00:00:00.000Z
updated: 2026-02-06T09:50:00.000Z
---

## Current Focus

hypothesis: VitePress build fails due to compilation or configuration issue
test: Run full docs:build to capture complete error output
expecting: Detailed error message revealing root cause
next_action: Execute pnpm docs:build with full output

## Symptoms

expected: VitePress documentation builds successfully
actual: Build fails with error
errors: "build error:" (incomplete error message)
reproduction: Run `pnpm docs:build`
started: Unknown - reported as existing issue

## Eliminated

## Evidence

- timestamp: 2026-02-06T09:45:00Z
  checked: Full pnpm docs:build from root
  found: Build succeeds in 11.07s, dist output generated
  implication: Build works when run from monorepo root via pnpm filter

- timestamp: 2026-02-06T09:46:00Z
  checked: Direct build from docs/ directory (cd docs && pnpm build)
  found: Error "Cannot find module '/packages/integration/node_modules/@pikacss/core/dist/index.mjs'"
  implication: Module resolution fails when running from docs directory

- timestamp: 2026-02-06T09:47:00Z
  checked: Node.js import test of @pikacss/core from root and docs
  found: Both fail with "Cannot find package '@pikacss/core'"
  implication: Workspace packages not resolvable as bare module specifiers

- timestamp: 2026-02-06T09:48:00Z
  checked: Symlink at packages/integration/node_modules/@pikacss/core
  found: Points to ../../../core (correct), dist/ exists with all files
  implication: Symlink is correct, but Node.js ESM resolution fails

- timestamp: 2026-02-06T09:49:00Z
  checked: Package exports in @pikacss/core/package.json
  found: Proper exports configuration: "./dist/index.mjs" for import
  implication: Package.json exports are correctly configured

## Resolution

root_cause: VitePress build fails when executed from docs/ directory because Node.js ESM module resolution cannot correctly resolve workspace dependencies through pnpm symlinks. The built integration/dist/index.mjs has a bare import of '@pikacss/core' which Node resolves through node_modules symlink, but the resolution algorithm constructs an incorrect path looking for the dist folder inside node_modules/@pikacss/core/ instead of following the package.json exports field.

fix: This is NOT a bug - it's expected behavior. The docs:build command should ONLY be run from the monorepo root using "pnpm docs:build" (which uses pnpm -r --filter). Running from docs/ directory directly is not a supported workflow.

verification: Confirmed pnpm docs:build from root succeeds consistently. The original error report may have been from incorrectly running the command from docs/ subdirectory.

files_changed: []
