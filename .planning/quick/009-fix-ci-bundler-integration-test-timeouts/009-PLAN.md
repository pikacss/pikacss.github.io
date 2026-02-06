---
type: quick-task
task: "009"
title: "Fix CI bundler integration test timeouts"
autonomous: true
---

# Quick Task 009: Fix CI Bundler Integration Test Timeouts

## Objective

Increase timeout values for bundler integration tests to prevent CI failures due to slower build times in CI environments (especially on Windows/macOS runners).

## Context

**Current situation:**
- Bundler integration tests take 38+ seconds locally
- Global testTimeout: 60s (vitest.config.eslint.ts)
- Nuxt beforeEach timeout: 60s
- Individual tests have no specific timeouts
- CI environments are slower than local, especially Windows

**Problem:**
- Tests approaching timeout limit (38s of 60s locally)
- CI runners can be 2-3x slower
- Risk of flaky test failures in CI

**Files:**
- `.eslint/tests/integration/bundlers.test.ts` - Integration tests
- `vitest.config.eslint.ts` - Vitest configuration

## Tasks

<task id="1" type="auto">

### Increase timeouts for bundler integration tests

**What:** Add individual test timeouts to all bundler integration tests and increase global timeout

**Why:** CI environments need more time for pnpm install and bundler builds

**Implementation:**
1. Increase global testTimeout in vitest.config.eslint.ts from 60s to 120s
2. Add 120s timeout to Vite tests (currently ~13s combined locally)
3. Increase Nuxt beforeEach to 120s, add 180s timeout to Nuxt test (currently 18s)
4. Add 120s timeout to Webpack test (currently 6s)

**Done when:**
- All test timeouts increased with 2-3x buffer for CI slowness
- Tests still pass locally
- Timeout values documented with comments

</task>

## Verification

```bash
# Tests should still pass
pnpm test:eslint

# Verify timeout settings
grep -n "timeout" .eslint/tests/integration/bundlers.test.ts
grep -n "testTimeout" vitest.config.eslint.ts
```

## Success Criteria

- [ ] Global testTimeout increased to 120s
- [ ] Individual test timeouts set with 2-3x buffer
- [ ] All bundler integration tests pass
- [ ] Timeout values documented

## Output

**Commits:**
1. `fix(eslint): increase bundler integration test timeouts for CI`

**Files Modified:**
- `.eslint/tests/integration/bundlers.test.ts`
- `vitest.config.eslint.ts`
