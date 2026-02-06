---
phase: quick
task: "010"
type: execute
autonomous: true

must_haves:
  truths:
    - "Bundler integration tests complete successfully in CI environments"
    - "Test timeouts provide sufficient buffer for slowest CI runners"
    - "No flaky timeout failures in GitHub Actions"
  artifacts:
    - path: "vitest.config.eslint.ts"
      provides: "Global test timeout configuration"
      min_lines: 15
    - path: ".eslint/tests/integration/bundlers.test.ts"
      provides: "Individual test timeout configurations"
      min_lines: 140
  key_links:
    - from: ".eslint/tests/integration/bundlers.test.ts"
      to: "vitest.config.eslint.ts"
      via: "inherits global testTimeout"
      pattern: "timeout:\\s*\\d+"
---

<objective>
Fix CI bundler integration test timeouts by applying more aggressive timeout increases based on actual CI runner performance data.

**Purpose:** Eliminate flaky test failures in CI environments where builds run significantly slower than local development (3-5x slowdown observed).

**Output:** Updated timeout configurations that provide sufficient buffer for slowest CI runners (Windows, macOS).
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/quick/009-fix-ci-bundler-integration-test-timeouts/009-SUMMARY.md

# Current timeout configuration
@vitest.config.eslint.ts
@.eslint/tests/integration/bundlers.test.ts
</context>

<tasks>

<task type="auto">
  <name>Increase test timeouts to 5x local baseline</name>
  <files>
    vitest.config.eslint.ts
    .eslint/tests/integration/bundlers.test.ts
  </files>
  <action>
**Problem Analysis:**
- Quick-009 set timeouts: global 120s, Vite/Webpack 120s, Nuxt 180s
- User reports tests still timing out on CI runners
- CI environments (especially Windows/macOS) can be 3-5x slower than local
- Local baseline: Vite (8-13s), Webpack (7s), Nuxt (14s + 14s install)

**Apply aggressive timeout increases (5x local baseline for safety):**

1. **vitest.config.eslint.ts:**
   - Change `testTimeout: 120000` to `testTimeout: 300000` (5 minutes)
   - Update comment to reflect 5x CI buffer: "// 300s = 5 min (5x buffer for slowest CI runners)"

2. **.eslint/tests/integration/bundlers.test.ts:**
   - Vite "valid examples" test: `timeout: 120000` → `timeout: 300000`
   - Vite "invalid examples" test: `timeout: 120000` → `timeout: 300000`
   - Nuxt beforeEach: `120000` → `300000` (for pnpm install)
   - Nuxt build test: `timeout: 180000` → `timeout: 360000` (6 minutes - Nuxt is most complex)
   - Webpack test: `timeout: 120000` → `timeout: 300000`

**Rationale:**
- 5x multiplier provides buffer for worst-case CI scenarios
- Nuxt gets extra buffer (6min) due to large dependency tree
- Local tests unaffected (still complete in 30-40s)
- No harm in generous timeouts - only matters when tests truly hang
  </action>
  <verify>
```bash
# Verify timeout changes
grep -n "testTimeout: 300000" vitest.config.eslint.ts
grep -n "timeout: 300000" .eslint/tests/integration/bundlers.test.ts
grep -n "timeout: 360000" .eslint/tests/integration/bundlers.test.ts
grep -n "}, 300000)" .eslint/tests/integration/bundlers.test.ts

# Run tests locally to ensure no regression
pnpm --filter @pikacss/eslint-config test
```
  </verify>
  <done>
- vitest.config.eslint.ts has testTimeout: 300000 (5 minutes)
- Vite tests have 300s timeout (5 minutes each)
- Nuxt beforeEach has 300s timeout (5 minutes for install)
- Nuxt build test has 360s timeout (6 minutes)
- Webpack test has 300s timeout (5 minutes)
- All 22 integration tests pass locally
- Comment updated to explain 5x CI buffer
  </done>
</task>

</tasks>

<verification>
**Test Execution:**
```bash
pnpm --filter @pikacss/eslint-config test
```
Expected: All 22 bundler integration tests pass (still complete in ~30-40s locally)

**Timeout Configuration Check:**
- Global timeout provides 5-minute fallback
- Individual tests have appropriate timeouts for complexity
- Nuxt (most complex) gets longest timeout (6 min)
- All timeouts provide 5x buffer over local baseline
</verification>

<success_criteria>
1. **Configuration Updated:**
   - vitest.config.eslint.ts has 300s global timeout
   - All 5 individual tests have updated timeouts (4×300s, 1×360s)
   - Comments explain CI buffer reasoning

2. **Tests Passing:**
   - All 22 integration tests pass locally
   - No test hangs or timeout locally
   - Sufficient buffer for slowest CI environments

3. **Git History:**
   - Single atomic commit: `fix(eslint): increase bundler test timeouts to 5x baseline for CI`
   - Changes limited to timeout configuration
</success_criteria>

<output>
After completion, create `.planning/quick/010-fix-ci-bundler-integration-test-timeouts/010-SUMMARY.md`
</output>
