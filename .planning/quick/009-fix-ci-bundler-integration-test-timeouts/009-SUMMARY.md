---
phase: quick
task: "009"
subsystem: testing
tags: [ci, vitest, timeout, bundler-tests]
requires: []
provides: [increased-ci-test-reliability]
affects: []
tech-stack:
  added: []
  patterns: [test-timeout-configuration]
key-files:
  created: []
  modified:
    - vitest.config.eslint.ts
    - .eslint/tests/integration/bundlers.test.ts
decisions:
  - "Increase global testTimeout from 60s to 120s for CI tolerance"
  - "Add individual test timeouts with 2-3x buffer for CI slowness"
  - "Nuxt tests get highest timeout (180s) due to large dependency tree"
metrics:
  duration: "~2 minutes"
  completed: "2026-02-06"
---

# Quick Task 009: Fix CI Bundler Integration Test Timeouts

**One-liner:** Increased bundler integration test timeouts to prevent flaky CI failures

## What Was Done

Increased timeout values throughout bundler integration tests to provide sufficient buffer for CI environments (which run 2-3x slower than local development).

### Changes Made

**vitest.config.eslint.ts:**
- Global `testTimeout`: 60s → 120s
- Updated comment to explain CI environment consideration

**.eslint/tests/integration/bundlers.test.ts:**
- Vite "valid examples" test: added 120s timeout
- Vite "invalid examples" test: added 120s timeout  
- Nuxt beforeEach: 60s → 120s (for pnpm install of large dependency tree)
- Nuxt build test: added 180s timeout (highest due to full Nuxt build)
- Webpack test: added 120s timeout

### Rationale

**Problem:**
- Local test runs take ~34-38 seconds total
- Individual tests: Vite (8s+5s), Nuxt (14s), Webpack (7s)
- Tests approaching 60s timeout limit locally
- CI environments are significantly slower (especially Windows/macOS runners)
- Risk of timeout failures in CI leading to flaky tests

**Solution:**
- 2-3x buffer for all timeouts accommodates CI slowness
- Individual test timeouts provide granular control
- Nuxt gets extra buffer due to large dependency tree installation

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Increase bundler test timeouts | 1156e58 | vitest.config.eslint.ts, bundlers.test.ts |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

**Test execution:**
```bash
✓ All 22 bundler integration tests passing
✓ Test duration: 33.85s (well under new 120s global timeout)
✓ Individual tests remain fast locally (8-14s range)
✓ Sufficient buffer for 2-3x CI slowdown
```

**Timeout verification:**
- Global timeout: 120s ✓
- Vite tests: 120s each ✓
- Nuxt beforeEach: 120s ✓
- Nuxt test: 180s ✓
- Webpack test: 120s ✓

## Next Phase Readiness

**Impact on other tests:** None - changes isolated to bundler integration tests

**CI reliability improvements:**
- Windows CI: should handle 2x slower builds
- macOS CI: should handle 2x slower builds  
- Ubuntu CI: ample buffer even if slower

## Technical Notes

**Timeout distribution strategy:**
- Base timeout for simple bundlers (Vite, Webpack): 120s
- Extended timeout for complex frameworks (Nuxt): 180s
- BeforeEach hooks get separate timeouts for install phase
- Global timeout serves as fallback for tests without individual timeouts

**Test performance baseline:**
- Vite valid: 8.2s locally → 120s allows 14x slowdown
- Vite invalid: 4.8s locally → 120s allows 25x slowdown
- Nuxt build: 14.1s locally → 180s allows 12x slowdown
- Webpack: 6.8s locally → 120s allows 17x slowdown

All tests have significant margin for CI environment overhead.

## Self-Check: PASSED

✓ vitest.config.eslint.ts exists and contains testTimeout: 120000
✓ bundlers.test.ts exists and contains 5 timeout configurations
✓ Commit 1156e58 exists in git history
✓ All tests passing with new timeout values
