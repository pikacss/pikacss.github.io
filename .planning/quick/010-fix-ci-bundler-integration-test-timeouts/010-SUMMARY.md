---
phase: quick
plan: "010"
subsystem: testing
tags: [vitest, ci, integration-tests, timeouts, bundlers]

# Dependency graph
requires:
  - phase: quick-009
    provides: Initial CI timeout configuration (2-3x baseline)
provides:
  - Aggressive CI timeout configuration (5x baseline)
  - Nuxt test special handling (6 minute timeout)
  - Comprehensive timeout buffer for slowest CI runners
affects: [ci, integration-testing, bundler-validation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "5x local baseline for CI timeout calculations"
    - "Nuxt gets extra buffer due to large dependency tree"

key-files:
  created: []
  modified:
    - vitest.config.eslint.ts
    - .eslint/tests/integration/bundlers.test.ts

key-decisions:
  - "5x multiplier provides buffer for worst-case CI scenarios (Windows/macOS)"
  - "Nuxt gets 6-minute timeout (360s) vs standard 5-minute (300s)"
  - "Generous timeouts acceptable - only matters when tests truly hang"

patterns-established:
  - "CI timeout calculation: local baseline × 5 for safety margin"
  - "Complex builds (Nuxt) get additional time buffer"

# Metrics
duration: 1.4min
completed: 2026-02-06
---

# Quick Task 010: Fix CI Bundler Integration Test Timeouts

**Increased bundler integration test timeouts from 2-3x to 5x local baseline, providing sufficient buffer for slowest CI runners (Windows/macOS)**

## Performance

- **Duration:** 1.4 minutes (83 seconds)
- **Started:** 2026-02-06T14:03:40Z
- **Completed:** 2026-02-06T14:05:03Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Global test timeout increased from 120s to 300s (5 minutes)
- All individual test timeouts increased by 2.5-3x
- Nuxt test given special 6-minute timeout due to complexity
- All 22 integration tests passing locally in ~30s with generous CI buffer

## Task Commits

Each task was committed atomically:

1. **Task 1: Increase test timeouts to 5x local baseline** - `3afb63d` (fix)

## Files Created/Modified

**Modified:**
- `vitest.config.eslint.ts` - Global testTimeout: 120s → 300s with updated comment
- `.eslint/tests/integration/bundlers.test.ts` - Individual test timeouts increased:
  - Vite "valid examples": 120s → 300s
  - Vite "invalid examples": 120s → 300s
  - Nuxt beforeEach (pnpm install): 120s → 300s
  - Nuxt build test: 180s → 360s (6 minutes)
  - Webpack test: 120s → 300s

## Timeout Configuration Details

### Before (quick-009):
```
Global:     120s (2 minutes)
Vite:       120s
Nuxt setup: 120s
Nuxt build: 180s (3 minutes)
Webpack:    120s
```

### After (quick-010):
```
Global:     300s (5 minutes) - 2.5x increase
Vite:       300s (5 minutes) - 2.5x increase
Nuxt setup: 300s (5 minutes) - 2.5x increase
Nuxt build: 360s (6 minutes) - 2.0x increase
Webpack:    300s (5 minutes) - 2.5x increase
```

### Rationale:
- **5x local baseline:** Vite (8-13s local) → 300s buffer, Webpack (7s local) → 300s buffer
- **Nuxt special case:** 14s build + 14s install locally → 360s total buffer (6 minutes)
- **CI slowdown factor:** Windows/macOS runners can be 3-5x slower than local
- **Safety margin:** Generous timeouts prevent false negatives, only matter when tests hang

## Decisions Made

1. **5x multiplier for CI buffer** - Provides worst-case scenario margin for slowest CI environments
2. **Nuxt gets extra buffer** - 6-minute timeout (vs standard 5 minutes) due to large dependency tree
3. **No harm in generous timeouts** - Tests complete quickly locally (~30s), buffer only matters for actual hangs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward timeout configuration update.

## Verification Results

```bash
# All timeout changes applied correctly
✓ vitest.config.eslint.ts: testTimeout: 300000
✓ bundlers.test.ts: 4× timeout: 300000
✓ bundlers.test.ts: 1× timeout: 360000 (Nuxt)
✓ bundlers.test.ts: 1× }, 300000) (Nuxt beforeEach)

# All 22 tests passing
✓ pika-package-boundaries.test.ts (3 tests) 2ms
✓ pika-module-augmentation.test.ts (12 tests) 4ms
✓ pika-build-time.test.ts (3 tests) 4ms
✓ bundlers.test.ts (4 tests) 30169ms
  ✓ Vite valid: 6944ms
  ✓ Vite invalid: 4759ms
  ✓ Nuxt build: 12935ms
  ✓ Webpack: 5530ms (non-blocking warning)

Total: 22 passed (30.51s total runtime)
```

## Next Phase Readiness

- CI bundler integration tests now have sufficient timeout buffer for all platforms
- No expected timeout failures in GitHub Actions (Windows/macOS/Linux)
- Ready for CI validation - tests should pass reliably across all runners

## Self-Check: PASSED

All files and commits verified:

**Modified files exist:**
✓ vitest.config.eslint.ts
✓ .eslint/tests/integration/bundlers.test.ts

**Commits exist:**
✓ 3afb63d - fix(quick-010): increase bundler test timeouts to 5x baseline for CI

---
*Phase: quick-010*
*Completed: 2026-02-06*
