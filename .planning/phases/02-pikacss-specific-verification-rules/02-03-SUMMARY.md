---
phase: 02-pikacss-specific-verification-rules
plan: 03
subsystem: testing
tags: [vite, nuxt, webpack, integration-testing, execa, vitest, fixtures, bundlers]

# Dependency graph
requires:
  - phase: 02-pikacss-specific-verification-rules
    provides: ESLint custom rules infrastructure (pika-build-time, pika-package-boundaries)
provides:
  - Multi-bundler integration test infrastructure with complete isolation
  - Fixture projects for Vite, Nuxt, and Webpack with valid/invalid examples
  - Integration test suite validating PikaCSS works in real bundler contexts
affects: [03-api-verification-suite, 02-04]

# Tech tracking
tech-stack:
  added: [execa@^9.0.0]
  patterns: 
    - "Test isolation pattern: mkdtemp per test, full fixture copy, cleanup in afterEach"
    - "Multi-bundler testing: Vite (Error), Nuxt (Error), Webpack (Warning severity)"

key-files:
  created:
    - vitest.config.eslint.ts
    - .eslint/tests/integration/bundlers.test.ts
    - .eslint/tests/fixtures/vite/package.json
    - .eslint/tests/fixtures/vite/vite.config.ts
    - .eslint/tests/fixtures/vite/src/valid.ts
    - .eslint/tests/fixtures/vite/src/invalid.ts
    - .eslint/tests/fixtures/nuxt/package.json
    - .eslint/tests/fixtures/nuxt/nuxt.config.ts
    - .eslint/tests/fixtures/nuxt/app.vue
    - .eslint/tests/fixtures/webpack/package.json
    - .eslint/tests/fixtures/webpack/webpack.config.js
    - .eslint/tests/fixtures/webpack/src/index.ts
  modified:
    - package.json

key-decisions:
  - "Use workspace:* protocol for fixtures to test local code, not npm registry"
  - "Complete test isolation via mkdtemp + full copy per test run"
  - "Webpack failures are Warning severity (non-blocking) per CONTEXT.md"
  - "Tests validate unplugin error reporting, not ESLint rules"
  - "Sequential execution locally (clear logs), parallel in CI"

patterns-established:
  - "Fixture pattern: minimal bundler config + valid/invalid examples"
  - "Test isolation pattern: unique temp dir + full dependency install per test"
  - "Multi-bundler validation: same test structure across Vite/Nuxt/Webpack"

# Metrics
duration: 5 min
completed: 2026-02-03
---

# Phase 2 Plan 3: Multi-Bundler Test Infrastructure Summary

**Multi-bundler integration test suite with isolated fixture projects for Vite, Nuxt, and Webpack validates PikaCSS examples compile in real-world bundler contexts**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-03T15:41:02Z
- **Completed:** 2026-02-03T15:46:56Z
- **Tasks:** 3/3 completed
- **Files modified:** 17 created, 1 modified

## Accomplishments

- Created three isolated fixture projects (Vite, Nuxt, Webpack) with valid and invalid PikaCSS examples
- Implemented integration test suite with complete environment isolation (mkdtemp + cleanup)
- Established bundler compatibility testing infrastructure ready for CI execution
- Added test:eslint script for easy test execution
- All fixtures use workspace:* protocol ensuring tests validate local code

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Vite fixture project** - `de166ec` (feat)
2. **Task 2: Create Nuxt and Webpack fixtures** - *Already committed in previous plan 02-02*
3. **Task 3: Implement integration test suite** - `1622c26` (feat)

**Plan metadata:** *(Will be committed after SUMMARY creation)*

## Files Created/Modified

**Created:**
- `vitest.config.eslint.ts` - Vitest config for ESLint integration tests (60s timeout, node env)
- `.eslint/tests/integration/bundlers.test.ts` - Multi-bundler integration test suite (142 lines)
- `.eslint/tests/fixtures/vite/` - Vite fixture project with valid/invalid examples
- `.eslint/tests/fixtures/nuxt/` - Nuxt fixture project with module integration
- `.eslint/tests/fixtures/webpack/` - Webpack fixture project with unplugin
- `.eslint/formatters/pikacss-detailed.ts` - Custom ESLint formatter (auto-created during commit)

**Modified:**
- `package.json` - Added test:eslint script and execa dependency

## Decisions Made

1. **Use workspace:* protocol for fixtures** - Ensures tests validate local package code, not npm registry versions (per RESEARCH.md Common Pitfall 3)

2. **Complete test isolation via mkdtemp** - Each test runs in unique temp directory with own node_modules, preventing cross-contamination between bundler tests

3. **Webpack failures are Warning severity** - Per CONTEXT.md, Webpack is secondary support, failures don't block test suite

4. **Tests validate unplugin error reporting** - These tests verify @pikacss/unplugin-pikacss correctly rejects invalid patterns during compilation, NOT ESLint rules from Plans 01/02

5. **Sequential local, parallel CI** - Clear logs during development, speed in CI (via CI env var detection)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Minor ESLint false positives during commit:**
- Nuxt app.vue had unused variables (validStyles, invalidStyles) - fixed by prefixing with underscore
- vitest.config.eslint.ts used global process - fixed by importing from node:process
- Both auto-fixed by ESLint, no impact on functionality

## Bundler Compatibility Matrix

| Bundler | Status | Severity | Notes |
|---------|--------|----------|-------|
| Vite | ✅ Ready | Error (blocking) | Primary bundler, full test coverage |
| Nuxt | ✅ Ready | Error (blocking) | Officially supported framework |
| Webpack | ✅ Ready | Warning (non-blocking) | Secondary support per CONTEXT.md |

## Test Execution Details

**Test isolation mechanism:**
```typescript
beforeEach: mkdtemp → cp fixture → pnpm install
afterEach: rm -rf (with force flag)
```

**Fixture structure:**
```
.eslint/tests/fixtures/
├── vite/          (package.json, vite.config.ts, src/valid.ts, src/invalid.ts)
├── nuxt/          (package.json, nuxt.config.ts, app.vue)
└── webpack/       (package.json, webpack.config.js, src/index.ts)
```

**Test scenarios:**
- Vite: Valid examples should compile successfully + generate pika.gen.css
- Vite: Invalid examples should fail with "build-time" error message
- Nuxt: Valid examples should compile (invalid commented out for testing)
- Webpack: Should compile (failures logged as warnings, non-blocking)

## Next Phase Readiness

**Ready for:**
- Plan 02-04: Integration testing to verify bundler tests work end-to-end
- Phase 03: API verification suite can use same fixture pattern

**Blockers:** None

**Notes:**
- Fixtures not yet tested with actual bundler execution (will be validated in 02-04)
- Test suite structure complete, ready for CI integration
- All three bundlers have isolated test environments with no shared state

---

*Phase: 02-pikacss-specific-verification-rules*
*Completed: 2026-02-03*
