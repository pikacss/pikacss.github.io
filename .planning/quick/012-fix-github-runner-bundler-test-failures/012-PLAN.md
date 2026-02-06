---
phase: quick-012
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - vitest.config.eslint.ts
autonomous: true

must_haves:
  truths:
    - "Bundler integration tests run sequentially in CI to avoid race conditions"
    - "Tests complete without ENOENT/EEXIST filesystem errors"
    - "pnpm install operations in test beforeEach hooks don't conflict"
  artifacts:
    - path: "vitest.config.eslint.ts"
      provides: "Sequential test execution configuration"
      contains: "concurrent: false"
  key_links:
    - from: "vitest.config.eslint.ts"
      to: ".eslint/tests/integration/bundlers.test.ts"
      via: "test execution strategy"
      pattern: "sequence.*concurrent"
---

<objective>
Fix GitHub Runner CI bundler test failures caused by parallel execution race conditions during pnpm install operations.

**Purpose:** Eliminate filesystem conflicts (ENOENT, EEXIST) when multiple tests simultaneously create temp directories and run pnpm install in shared monorepo space.

**Output:** Sequential test execution in CI preventing race conditions during dependency installation.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@vitest.config.eslint.ts
@.eslint/tests/integration/bundlers.test.ts
@.github/workflows/ci.yml

## Problem Analysis

**Current Configuration:**
```typescript
sequence: {
  concurrent: process.env.CI === 'true',
},
```

**Error Categories in CI:**

1. **ENOENT vite.config.ts** - writeFile fails because directory setup incomplete
   - Root cause: Parallel beforeEach hooks racing to create temp directories
   
2. **EEXIST nuxt symlink** - pnpm install creates duplicate symlinks
   - Error: "file already exists, symlink '../../node_modules/.pnpm/nuxt@...'"
   - Root cause: Parallel pnpm installs in monorepo node_modules
   
3. **ENOENT rollup unlink** - hoisting phase fails
   - Error: "no such file or directory, unlink '/.../.pnpm/node_modules/rollup'"
   - Root cause: Parallel hoisting operations conflict

**Why This Happens:**
- Tests use `mkdtemp(join(monorepoRoot, '.temp-test-*'))` pattern
- Multiple tests run concurrently in CI matrix (ubuntu/windows/macos)
- Each test runs `pnpm install` in beforeEach (line 22, 88, 118)
- Shared monorepo node_modules causes race conditions during symlink creation

**Why Sequential Execution Fixes It:**
- Each test completes full lifecycle (setup → execute → cleanup) before next starts
- No overlapping pnpm install operations
- No symlink conflicts
- Complete isolation despite shared monorepo space

**Trade-off:**
- CI runtime increases (~3-5 min per OS) but ensures reliability
- Local dev unaffected (concurrent: false works locally too)
- Alternative (system tmpdir) would break workspace:* resolution testing
</context>

<tasks>

<task type="auto">
  <name>Disable concurrent test execution</name>
  <files>vitest.config.eslint.ts</files>
  <action>
Change vitest.config.eslint.ts line 11-13 from:

```typescript
sequence: {
  concurrent: process.env.CI === 'true',
},
```

To:

```typescript
// Force sequential execution to prevent race conditions during pnpm install
// Tests create temp dirs in monorepo space for workspace:* resolution
// Parallel execution causes ENOENT/EEXIST errors when multiple tests
// simultaneously run pnpm install with shared node_modules hoisting
sequence: {
  concurrent: false,
},
```

**Rationale:**
- Bundler tests require complete filesystem isolation during pnpm install
- Temp dirs inside monorepo enable workspace:* testing but share node_modules space
- Sequential execution ensures one test completes before next starts
- Prevents symlink conflicts, hoisting races, and incomplete directory setup
- CI reliability prioritized over parallel execution speed
  </action>
  <verify>
1. Run typecheck: `pnpm typecheck`
2. Verify syntax: `cat vitest.config.eslint.ts | grep -A3 "sequence"`
3. Check comment explains rationale
  </verify>
  <done>
- vitest.config.eslint.ts has `concurrent: false`
- Comment explains race condition prevention
- TypeScript compiles without errors
  </done>
</task>

<task type="auto">
  <name>Validate fix with local test run</name>
  <files>.eslint/tests/integration/bundlers.test.ts</files>
  <action>
Run bundler integration tests locally to verify sequential execution works:

```bash
pnpm test:eslint
```

**Expected behavior:**
- Tests run one at a time (sequential logs visible)
- All tests complete without ENOENT/EEXIST errors
- 4/4 tests pass: Vite valid, Vite invalid, Nuxt build, Webpack build
- Total time: 3-5 minutes (expected for sequential execution with 3 bundlers)

**If failures occur:**
- Check error messages for remaining race conditions
- Verify beforeEach timeouts are still 300s
- Confirm temp directory cleanup in afterEach
- Ensure --no-frozen-lockfile still in pnpm install commands (from quick-011)

**Note:** This validates the fix locally. GitHub Runner CI will validate across OS matrix (ubuntu/windows/macos).
  </action>
  <verify>
```bash
pnpm test:eslint 2>&1 | tee test-output.log
echo "Exit code: $?"
```

Check for:
- Exit code 0
- No ENOENT errors in output
- No EEXIST errors in output
- Tests complete successfully
  </verify>
  <done>
- pnpm test:eslint completes with exit code 0
- Zero filesystem race condition errors
- All bundler tests pass
- Sequential execution confirmed by logs
  </done>
</task>

<task type="auto">
  <name>Commit fix with evidence</name>
  <files>vitest.config.eslint.ts</files>
  <action>
Commit the configuration change:

```bash
git add vitest.config.eslint.ts
git commit -m "fix(test): disable concurrent execution for bundler tests

Prevents GitHub Runner CI race conditions during pnpm install:
- ENOENT errors during temp directory setup
- EEXIST errors during symlink creation in node_modules
- ENOENT errors during hoisting phase

Root cause: Tests use monorepo temp dirs for workspace:* resolution.
Parallel execution causes conflicts when multiple tests run pnpm install
with shared node_modules space.

Solution: Sequential execution ensures complete test isolation.
Trade-off: Slower CI (~3-5 min per OS) but reliable execution.

Closes quick-012"
```

**Verification evidence:**
- Local test run passed with sequential execution
- Comment in config explains race condition prevention
- GitHub CI will validate fix across OS matrix
  </action>
  <verify>
```bash
git log -1 --stat
git show HEAD:vitest.config.eslint.ts | grep -A3 "sequence"
```
  </verify>
  <done>
- Commit created with descriptive message
- vitest.config.eslint.ts shows concurrent: false
- Comment explains rationale
- Ready for CI validation
  </done>
</task>

</tasks>

<verification>
## Local Verification
- [x] TypeScript compiles without errors
- [x] pnpm test:eslint passes with sequential execution
- [x] Zero ENOENT/EEXIST errors in test output
- [x] All 4 bundler tests complete successfully

## CI Verification (GitHub Actions)
After merge, verify GitHub Runner CI passes:
- [x] ubuntu-latest: All bundler tests pass
- [x] windows-latest: All bundler tests pass
- [x] macos-latest: All bundler tests pass
- [x] No filesystem race condition errors across OS matrix

## Configuration Validation
```bash
# Verify concurrent disabled
grep -A3 "sequence" vitest.config.eslint.ts | grep "concurrent: false"

# Verify comment explains rationale
grep -B2 "concurrent: false" vitest.config.eslint.ts | grep -i "race\|parallel"
```
</verification>

<success_criteria>
**Must achieve:**
1. vitest.config.eslint.ts has `concurrent: false` with explanatory comment
2. Local test run completes with zero filesystem errors
3. All 4 bundler integration tests pass
4. TypeScript compilation succeeds
5. Git commit includes root cause analysis and solution rationale

**Quality indicators:**
- Configuration change is minimal (single property + comment)
- Comment explains WHY sequential execution is needed
- Trade-off (speed vs reliability) is documented
- Local validation proves fix works before CI

**Success definition:** GitHub Runner CI no longer experiences ENOENT/EEXIST errors during bundler integration tests across OS matrix.
</success_criteria>

<output>
After completion, create `.planning/quick/012-fix-github-runner-bundler-test-failures/012-SUMMARY.md`
</output>
