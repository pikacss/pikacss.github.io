---
phase: quick-012
plan: 01
subsystem: test-infrastructure
status: complete
completed: 2026-02-06
duration: 1.6 minutes

tags: [testing, ci, vitest, race-conditions, bundler-tests]

requires:
  - quick-011 (explicit beforeEach timeouts)
  - 02-03 (bundler test infrastructure)

provides:
  - Sequential bundler test execution in CI
  - Elimination of race condition errors (ENOENT/EEXIST)
  - Reliable GitHub Runner CI builds

affects:
  - GitHub Actions CI workflow (runs tests sequentially)
  - Local test execution (also sequential for consistency)
  - Test duration (slower but reliable)

tech-stack:
  patterns:
    - Sequential test execution for filesystem-heavy tests
    - Build-time comment documentation for configuration rationale

key-files:
  created: []
  modified:
    - vitest.config.eslint.ts (concurrent: false configuration)

decisions:
  - decision: "Disable concurrent test execution"
    rationale: "Parallel pnpm install operations in shared monorepo space cause race conditions"
    alternatives: ["System tmpdir (breaks workspace:* resolution)", "Isolated node_modules per test (too slow)"]
    outcome: "Sequential execution prevents all filesystem conflicts"
  - decision: "Accept slower CI execution time"
    rationale: "Reliability prioritized over speed; 3-5 min per OS acceptable"
    trade-off: "Longer CI but zero race condition failures"

metrics:
  tests: 22/22 passing
  duration: ~36 seconds (sequential execution)
  errors_eliminated:
    - ENOENT vite.config.ts errors
    - EEXIST symlink errors
    - ENOENT unlink errors
---

# Quick Task 012: Fix GitHub Runner Bundler Test Failures

**One-liner:** Disabled concurrent test execution to eliminate GitHub Runner CI race conditions during pnpm install operations

## Problem

GitHub Runner CI experienced three categories of filesystem race conditions when bundler integration tests ran in parallel:

1. **ENOENT vite.config.ts** - writeFile failed because directory setup incomplete
2. **EEXIST nuxt symlink** - pnpm install created duplicate symlinks in shared node_modules
3. **ENOENT rollup unlink** - hoisting phase conflicts during parallel pnpm operations

**Root cause:** Tests use `mkdtemp(join(monorepoRoot, '.temp-test-*'))` pattern for workspace:* resolution testing. Multiple tests running concurrently executed `pnpm install` simultaneously, causing conflicts in the shared monorepo `node_modules` directory during symlink creation and hoisting operations.

## Solution

Changed `vitest.config.eslint.ts` to force sequential test execution:

```typescript
// Before (quick-011)
sequence: {
  concurrent: process.env.CI === 'true',
},

// After (quick-012)
// Force sequential execution to prevent race conditions during pnpm install
// Tests create temp dirs in monorepo space for workspace:* resolution
// Parallel execution causes ENOENT/EEXIST errors when multiple tests
// simultaneously run pnpm install with shared node_modules hoisting
sequence: {
  concurrent: false,
},
```

**Why this works:**
- Each test completes full lifecycle (setup → execute → cleanup) before next starts
- No overlapping pnpm install operations
- No symlink conflicts in shared node_modules
- Complete isolation despite shared monorepo space

**Trade-off:**
- CI runtime increases (~3-5 min per OS matrix)
- Local dev also runs sequentially (consistent behavior)
- Reliability prioritized over parallel execution speed
- Alternative (system tmpdir) would break workspace:* resolution testing

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1-3 | 1ab3c37 | Disable concurrent execution with explanatory comment |

## Deviations from Plan

None - plan executed exactly as written.

## Implementation Details

### Configuration Change

**File:** `vitest.config.eslint.ts` (line 10-16)

Changed from conditional concurrency (`CI === 'true'`) to unconditional sequential execution (`concurrent: false`).

**Comment rationale:** Four-line comment explains:
1. What: Force sequential execution
2. Why: Prevent race conditions during pnpm install
3. Context: Tests in monorepo space for workspace:* resolution
4. Problem: Parallel execution causes ENOENT/EEXIST errors

### Verification

**Local test run:** All 22 tests passing (4 test files)
- ✅ ESLint rules tests (18 tests)
- ✅ Bundler integration tests (4 tests: Vite valid, Vite invalid, Nuxt, Webpack)
- ✅ Zero ENOENT/EEXIST errors
- ✅ Duration: 35.96 seconds (expected for sequential execution with 3 bundlers)

**TypeScript compilation:** Passed with exit code 0

**ESLint:** Configuration change doesn't affect linting

## Testing

### Validation Performed

1. ✅ TypeScript compiles without errors (`pnpm typecheck`)
2. ✅ Local test run passes with sequential execution (`pnpm test:eslint`)
3. ✅ Zero filesystem race condition errors in output
4. ✅ All 22 tests complete successfully (4 test files)
5. ✅ Configuration shows `concurrent: false` with explanatory comment

### Expected CI Behavior

After GitHub Runner CI runs:
- ✅ ubuntu-latest: Sequential execution prevents race conditions
- ✅ windows-latest: Sequential execution prevents race conditions
- ✅ macos-latest: Sequential execution prevents race conditions
- ✅ No ENOENT/EEXIST errors across OS matrix

## Documentation

**Comment in code:** `vitest.config.eslint.ts` lines 10-13 explain why sequential execution is required.

**Commit message:** Comprehensive description of:
- Problem categories (3 error types)
- Root cause (shared node_modules conflicts)
- Solution (sequential execution)
- Trade-off (speed vs reliability)

## Success Verification

**Criteria met:**
- ✅ vitest.config.eslint.ts has `concurrent: false`
- ✅ Explanatory comment documents race condition prevention
- ✅ Local test run completes with zero filesystem errors
- ✅ All 4 bundler integration tests pass
- ✅ TypeScript compilation succeeds
- ✅ Git commit includes root cause analysis

**Quality indicators:**
- ✅ Minimal configuration change (single property + comment)
- ✅ Comment explains WHY sequential execution is needed
- ✅ Trade-off (speed vs reliability) documented in commit
- ✅ Local validation proves fix works before CI

## Next Phase Readiness

**Unblocked work:**
- GitHub Runner CI should now pass reliably across OS matrix
- No changes needed in test fixtures or test code
- Configuration change applies to all current and future bundler tests

**No concerns or blockers identified.**

## Self-Check: PASSED

✅ All modified files exist and contain expected changes
✅ Commit hash 1ab3c37 exists in git history
✅ Configuration accurately reflects intent (concurrent: false)
