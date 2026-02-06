---
type: quick
task_id: "008"
title: Fix CI bundler integration tests to use --no-frozen-lockfile
created: 2026-02-06
directory: .planning/quick/008-fix-ci-bundler-integration-tests-to-use-
context_budget: ~30%
---

# Quick Task 008: Fix CI Bundler Integration Tests

## Objective

Fix GitHub Actions CI failures in ESLint integration tests by adding `--no-frozen-lockfile` flag to all `pnpm install` commands.

**Purpose:** CI environments default to `--frozen-lockfile=true`, which fails when test fixtures create new package.json files with different dependencies than the monorepo lockfile.

**Output:** Updated integration test file with CI-compatible pnpm install commands.

## Problem Analysis

**Root Cause:**
- Tests create temporary directories inside monorepo (`.temp-test-*` pattern)
- Tests copy package.json files with new dependencies (webpack, ts-loader, etc.)
- Tests run `pnpm install` which defaults to `--frozen-lockfile` in CI
- pnpm detects lockfile mismatch and fails with `ERR_PNPM_OUTDATED_LOCKFILE`

**Affected Lines:**
- Line 22: Vite fixture installation
- Line 88: Nuxt fixture installation  
- Line 118: Webpack fixture installation

## Context

- **File:** `.eslint/tests/integration/bundlers.test.ts`
- **Current behavior:** Tests pass locally (frozen-lockfile disabled by default)
- **CI behavior:** Tests fail due to frozen-lockfile enforcement
- **Solution:** Explicitly add `--no-frozen-lockfile` flag

## Tasks

### Task 1: Add --no-frozen-lockfile to pnpm install commands

**Files:**
- `.eslint/tests/integration/bundlers.test.ts`

**Action:**
Update all three `pnpm install` commands to include `--no-frozen-lockfile` flag:

1. Line 22 (Vite beforeEach):
   ```typescript
   await execa('pnpm', ['install', '--no-frozen-lockfile'], { cwd: testDir })
   ```

2. Line 88 (Nuxt beforeEach):
   ```typescript
   await execa('pnpm', ['install', '--no-frozen-lockfile'], { cwd: testDir })
   ```

3. Line 118 (Webpack beforeEach):
   ```typescript
   await execa('pnpm', ['install', '--no-frozen-lockfile'], { cwd: testDir })
   ```

**Rationale:**
- Test fixtures have different dependencies than monorepo lockfile
- `--no-frozen-lockfile` allows pnpm to update lockfile during install
- Consistent behavior between local development and CI
- Follows pattern from similar integration test suites

**Verify:**
```bash
# Run integration tests locally
pnpm --filter @eslint test

# Expected: All tests pass with same behavior as before
# Tests create temp dirs, install deps, run builds, cleanup
```

**Done:**
- All three pnpm install commands include `--no-frozen-lockfile`
- Tests pass locally with exit code 0
- CI pipeline will accept new package installations in test fixtures

## Success Criteria

- [ ] Line 22: `['install', '--no-frozen-lockfile']` array in execa call
- [ ] Line 88: `['install', '--no-frozen-lockfile']` array in execa call
- [ ] Line 118: `['install', '--no-frozen-lockfile']` array in execa call
- [ ] `pnpm --filter @eslint test` passes locally
- [ ] No changes to test behavior or assertions
- [ ] File committed with atomic commit message

## Verification Commands

```bash
# Verify changes
git diff .eslint/tests/integration/bundlers.test.ts

# Run tests
pnpm --filter @eslint test

# Check ESLint
pnpm lint

# Commit
git add .eslint/tests/integration/bundlers.test.ts
git commit -m "fix(eslint): add --no-frozen-lockfile to bundler integration tests

Tests create temp directories with new package.json files.
CI defaults to --frozen-lockfile which blocks installs.
Explicit flag allows pnpm to install fixture dependencies."
```

## Notes

- This is a CI-specific fix; local behavior unchanged
- Follows established pattern for integration tests with dynamic dependencies
- Does not affect production code or user-facing behavior
- Enables test fixtures to use workspace:* while having additional dependencies
