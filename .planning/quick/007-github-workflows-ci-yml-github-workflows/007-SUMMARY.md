---
task: quick-007
subsystem: testing
tags: [ci, github-actions, eslint, vitest, validation]

# Dependency graph
requires:
  - task: quick-006
    provides: 100% ESLint compliance across all markdown files
provides:
  - Both GitHub Actions workflows (ci.yml and docs-validation.yml) pass locally
  - Test timeout fixes for long-running integration tests
  - ESLint TypeScript module resolution for CI scripts
  - Updated skills path in validation scripts
affects: [ci, testing, documentation]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
    - packages/api-verifier/tests/integration/end-to-end.test.ts
    - scripts/run-pikacss-validation.sh

key-decisions:
  - "Increased end-to-end test timeout from 15s to 30s for comprehensive package scanning"
  - "Added NODE_OPTIONS='--import tsx' to PikaCSS validation script for TypeScript ESLint rules"
  - "Fixed test regex to match tsx code fence language used in skills documentation"

patterns-established: []

# Metrics
duration: 7.2min
completed: 2026-02-06
---

# Quick Task 007: GitHub CI Workflows Local Validation

**Fixed three blocking CI workflow issues enabling complete local validation before GitHub Actions runs**

## Performance

- **Duration:** 7.2 minutes (433 seconds)
- **Started:** 2026-02-06T13:21:29Z
- **Completed:** 2026-02-06T13:28:42Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- All ci.yml workflow steps pass locally (build, lint, typecheck, test)
- All docs-validation.yml workflow steps pass locally (structural + PikaCSS validation + API verification)
- Fixed two test failures preventing test suite from passing
- Fixed ESLint module resolution preventing PikaCSS validation from running

## Task Commits

Each fix was identified and committed atomically:

1. **Single commit containing all fixes** - `e14f31f` (fix)
   - Test timeout increase (15s → 30s)
   - Test regex fix (typescript → tsx)
   - ESLint module resolution fix (NODE_OPTIONS='--import tsx')
   - Skills path update (.github/skills → ./skills)

## Files Created/Modified
- `packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts` - Fixed code fence language regex from `typescript` to `tsx`
- `packages/api-verifier/tests/integration/end-to-end.test.ts` - Increased timeout from 15000ms to 30000ms
- `scripts/run-pikacss-validation.sh` - Added NODE_OPTIONS='--import tsx' and updated skills path

## Decisions Made

**1. Test timeout strategy**
- Increased end-to-end integration test timeout from 15s to 30s
- Rationale: Test scans all 9 monorepo packages and consistently takes 24-26s to complete
- Impact: Test now has sufficient time to complete without timing out

**2. ESLint module resolution approach**
- Added `NODE_OPTIONS='--import tsx'` environment variable to PikaCSS validation script
- Rationale: PikaCSS ESLint rules are TypeScript files requiring tsx loader at runtime
- Consistent with existing `pnpm lint` command pattern in package.json
- Impact: ESLint can now successfully load and execute TypeScript custom rules

**3. Code fence language specificity**
- Changed test regex from `typescript` to `tsx` to match actual documentation
- Rationale: Skills documentation correctly uses `tsx` for JSX-containing examples (established in quick-004)
- Impact: Test now correctly extracts Static Evaluation Requirement section from SKILL.md

## Deviations from Plan

None - all fixes followed plan exactly as specified.

Plan directed: "Run each CI workflow step locally and fix any failures iteratively"
Execution: Ran all steps, identified 3 specific failures, applied targeted fixes, re-ran to verify.

## Issues Encountered

**Issue 1: Test failures blocking test suite**
- **Encountered during:** Task 1 (Running pnpm test)
- **Root cause:** Two test files had failures (regex mismatch + timeout)
- **Resolution:** 
  - Fixed pikacss-expert-skill.test.ts regex to match tsx code fences
  - Increased end-to-end.test.ts timeout to 30s for package scanning
- **Verification:** All 247/247 tests passing after fixes

**Issue 2: ESLint module resolution error**
- **Encountered during:** Task 2 (Running pnpm validate:pikacss)
- **Root cause:** ESLint couldn't find TypeScript module `/Users/.../pika-build-time`
- **Resolution:** Added `NODE_OPTIONS='--import tsx'` to run-pikacss-validation.sh
- **Verification:** ESLint successfully loaded custom rules with 0 errors, 110 warnings (documented false positives)

**Issue 3: Outdated path reference**
- **Encountered during:** Task 2 (Running PikaCSS validation script)
- **Root cause:** Script referenced `.github/skills/**/*.md` but skills moved to `./skills` in quick-001
- **Resolution:** Updated path pattern in run-pikacss-validation.sh
- **Verification:** Script now correctly lints all skill files

## Complete Validation Results

**CI Workflow (ci.yml):**
- ✅ `pnpm install` - Dependencies installed
- ✅ `pnpm build` - All 9 packages built successfully
- ✅ `pnpm lint` - 0 errors, 109 warnings (false positives)
- ✅ `pnpm typecheck` - All packages type-check clean
- ✅ `pnpm test` - 247/247 tests passing (31 test files)

**Docs Validation Workflow (docs-validation.yml):**

Structural Validation:
- ✅ `bash scripts/run-all-checks.sh` - 4/4 checks passed
  - ESLint markdown validation
  - Internal link validation
  - File reference validation
  - Placeholder detection

PikaCSS Validation:
- ✅ `pnpm validate:pikacss` - All validations passed
  - ESLint with PikaCSS custom rules (0 errors)
  - Multi-bundler integration tests (22/22 passing)
- ✅ `bash scripts/verify-api-docs.sh` - All API documentation accurate

## Next Steps

Repository is now CI-ready:
- All local validations match what will run in GitHub Actions
- Developers can confidently run validation suite before pushing
- CI failures should not occur for validation issues (only external factors like network)

---
*Task: quick-007*
*Completed: 2026-02-06*
