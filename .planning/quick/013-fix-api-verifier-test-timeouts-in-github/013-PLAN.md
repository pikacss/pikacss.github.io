---
phase: quick-013
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/api-verifier/vitest.config.ts
  - packages/api-verifier/tests/integration/end-to-end.test.ts
  - packages/api-verifier/tests/unit/extractor.test.ts
autonomous: true

must_haves:
  truths:
    - "Tests pass in GitHub Runner CI without timeout errors"
    - "Tests remain fast locally (no performance regression)"
    - "Timeout buffer is proportional to CI vs local execution difference"
  artifacts:
    - path: "packages/api-verifier/vitest.config.ts"
      provides: "Global CI-aware timeout configuration"
      min_lines: 10
    - path: "packages/api-verifier/tests/integration/end-to-end.test.ts"
      provides: "Increased test-level timeouts for TypeScript compilation"
      contains: "120000"
    - path: "packages/api-verifier/tests/unit/extractor.test.ts"
      provides: "Increased test-level timeout for API extraction"
      contains: "15000"
  key_links:
    - from: "vitest.config.ts"
      to: "process.env.CI"
      via: "global testTimeout conditional"
      pattern: "testTimeout.*CI"
    - from: "end-to-end.test.ts"
      to: "verifyAllPackages"
      via: "test timeout annotation"
      pattern: "\\},\\s*\\d{5,}"
---

<objective>
Fix api-verifier test timeouts in GitHub Runner CI by increasing timeout values proportionally to observed CI slowdown patterns.

Purpose: TypeScript Compiler API operations (type extraction, compilation) are CPU-intensive and run 3-5x slower in CI environments than local development machines. Current timeouts (5s, 10s, 30s) are insufficient for CI execution.

Output: All api-verifier tests pass reliably in GitHub Runner CI across all platforms (ubuntu-latest, windows-latest, macos-latest) without timeout errors.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@packages/api-verifier/vitest.config.ts
@packages/api-verifier/tests/integration/end-to-end.test.ts
@packages/api-verifier/tests/unit/extractor.test.ts

**Pattern from Quick Tasks 009-012:**
- CI environments run 3-5x slower than local for CPU-intensive operations
- Bundler tests use 300s (5x baseline) global timeout with 300-360s individual timeouts
- Same pattern needed for TypeScript compilation-heavy tests

**Current Failures:**
- `end-to-end.test.ts` - "should generate reports for all packages" timing out at 30000ms (30s)
- `extractor.test.ts` - "should extract APIs from @pikacss/core" timing out at 5000ms (5s)

**Root Cause:**
TypeScript Compiler API operations (createProgram, type checker, AST traversal) are CPU-bound and significantly slower in CI's virtualized, resource-constrained environments.
</context>

<tasks>

<task type="auto">
  <name>Add CI-aware global timeout configuration</name>
  <files>packages/api-verifier/vitest.config.ts</files>
  <action>
Add global testTimeout configuration with CI detection to vitest.config.ts:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // TypeScript Compiler API operations are CPU-intensive
    // CI environments run 3-5x slower than local machines
    testTimeout: process.env.CI === 'true' ? 120000 : 30000, // 2 min CI, 30s local
  },
})
```

**Rationale:**
- Local development: 30s sufficient for TypeScript compilation (typical: 5-15s)
- CI environment: 120s provides 4x buffer for slower CPU, virtualization overhead
- Consistent with bundler test pattern (quick-009 through quick-012)
  </action>
  <verify>
Run: `cat packages/api-verifier/vitest.config.ts`
Confirm: testTimeout field exists with CI conditional
Confirm: Values are 120000 (CI) and 30000 (local)
  </verify>
  <done>
vitest.config.ts contains global testTimeout with CI detection, providing 2-minute timeout for CI and 30-second timeout for local execution.
  </done>
</task>

<task type="auto">
  <name>Increase end-to-end test timeout to 2 minutes</name>
  <files>packages/api-verifier/tests/integration/end-to-end.test.ts</files>
  <action>
Update timeout annotations in end-to-end.test.ts:

**Test 1: "should verify a single package with mock data"**
- Current: `}, 10000)` (10s)
- Change to: `}, 30000)` (30s)
- Reason: Single package extraction typically 3-5s local, may reach 15-20s in CI

**Test 2: "should generate reports for all packages"**
- Current: `}, 30000)` (30s)
- Change to: `}, 120000)` (2 minutes)
- Reason: Processes all 9 monorepo packages, each requiring TypeScript compilation; observed timeout at 30s in CI

Update both timeout values. Keep comments explaining TypeScript compilation overhead.
  </action>
  <verify>
Run: `grep -n '}, [0-9]\+)' packages/api-verifier/tests/integration/end-to-end.test.ts`
Confirm: Line ~72 shows `}, 30000)`
Confirm: Line ~122 shows `}, 120000)`
  </verify>
  <done>
end-to-end.test.ts has increased timeouts: 30s for single-package verification, 120s for all-packages report generation. Comments document TypeScript compilation overhead.
  </done>
</task>

<task type="auto">
  <name>Increase extractor test timeout to 15 seconds</name>
  <files>packages/api-verifier/tests/unit/extractor.test.ts</files>
  <action>
Add timeout annotation to "should extract APIs from @pikacss/core" test in extractor.test.ts:

**Location:** Line ~110, after the test function closing brace
**Current:** No explicit timeout (uses global default)
**Change to:** Add `, 15000)` timeout annotation

**Pattern:**
```typescript
it('should extract APIs from @pikacss/core', () => {
  // ... test body ...
}, 15000) // TypeScript compilation + API extraction
```

**Rationale:**
- Test performs TypeScript Compiler API extraction on @pikacss/core
- Typical local execution: 1-3s
- CI worst-case: 5-10s (observed timeout at default 5s)
- 15s provides 5x local baseline, sufficient for CI
  </action>
  <verify>
Run: `grep -A 20 "should extract APIs from @pikacss/core" packages/api-verifier/tests/unit/extractor.test.ts | grep -n "}, 15000)"`
Confirm: Output shows timeout annotation with 15000ms
  </verify>
  <done>
extractor.test.ts has explicit 15s timeout on TypeScript compilation test, providing sufficient buffer for CI execution while maintaining fast feedback locally.
  </done>
</task>

</tasks>

<verification>
**Local Test Execution:**
```bash
pnpm --filter @pikacss/api-verifier test
```
Confirm: All tests pass (typical duration: 5-15s)
Confirm: No timeout warnings

**Simulated CI Test Execution:**
```bash
CI=true pnpm --filter @pikacss/api-verifier test
```
Confirm: All tests pass with CI timeouts active
Confirm: Tests complete within configured limits

**Full CI Pipeline:**
Wait for GitHub Actions test job across all OS matrix (ubuntu/windows/macos)
Confirm: api-verifier tests pass on all platforms
Confirm: No timeout errors in test output
</verification>

<success_criteria>
- [ ] vitest.config.ts has CI-aware global testTimeout (120s CI, 30s local)
- [ ] end-to-end.test.ts has increased timeouts (30s single package, 120s all packages)
- [ ] extractor.test.ts has 15s timeout on TypeScript compilation test
- [ ] Local tests pass quickly (5-15s typical duration)
- [ ] CI tests pass without timeouts (GitHub Actions across ubuntu/windows/macos)
- [ ] Timeout values follow established pattern from quick-009 through quick-012
- [ ] Comments document TypeScript compilation overhead as timeout reason
</success_criteria>

<output>
After completion, create `.planning/quick/013-fix-api-verifier-test-timeouts-in-github/013-SUMMARY.md`
</output>
