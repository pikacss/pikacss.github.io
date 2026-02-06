---
status: resolved
trigger: "15 tests failing in api-verifier package"
created: 2026-02-06T00:00:00Z
updated: 2026-02-06T00:00:00Z
---

## Current Focus

hypothesis: verifyAllPackages glob parsing fails with absolute paths - splits on '/' and gets wrong directory
test: Fix glob pattern parsing to handle both relative and absolute paths
expecting: Test should pass when function can correctly extract base directory from absolute paths
next_action: Implement fix to handle absolute paths in glob pattern parsing

## Symptoms

expected: All 130 tests in api-verifier should pass
actual: 1 test failing in end-to-end.test.ts: "should generate reports for all packages"
errors: "Error: ENOENT: no such file or directory, scandir 'docs'"
reproduction: Run `pnpm --filter @pikacss/api-verifier test`
started: User reported 15 failures, but current run shows only 1 failure

## Eliminated

- hypothesis: extractor.test.ts has 14 failures
  evidence: All 20 tests in extractor.test.ts are passing (marked with ✓)
  timestamp: 2026-02-06T00:00:01Z

## Evidence

- timestamp: 2026-02-06T00:00:01Z
  checked: Ran api-verifier tests
  found: 129/130 tests passing. Only 1 failure in end-to-end.test.ts
  implication: User's report was outdated or issue was already fixed

- timestamp: 2026-02-06T00:00:02Z
  checked: Failing test "should generate reports for all packages"
  found: Test passes docGlob as `${testDir}/**/*.md` where testDir is tmpdir() path
  implication: Pattern splitting logic assumes relative paths like "docs/**/*.md"

- timestamp: 2026-02-06T00:00:03Z
  checked: verifyAllPackages function in src/index.ts line 90
  found: docDir = docGlob.split('/')[0] || 'docs' - extracts first path segment
  implication: For absolute path like "/var/folders/xyz/**/*.md", it extracts "/var" not the temp dir

- timestamp: 2026-02-06T00:00:04Z
  checked: Error message shows "scandir 'docs'" 
  found: When split fails on absolute path, falls back to 'docs' which doesn't exist in test context
  implication: Need to handle absolute paths properly in glob pattern parsing

## Resolution

root_cause: The verifyAllPackages function's glob pattern parsing used naive string splitting (docGlob.split('/')[0]) which failed for absolute paths. When tests passed absolute paths like "/var/folders/.../test-123/**/*.md", it would extract "/var" as the base directory instead of the temp directory, causing ENOENT errors.

fix: Updated glob pattern parsing in src/index.ts to handle both relative and absolute paths:
- For absolute paths: Extract directory up to first glob pattern character (*, ?, [)
- For relative paths: Keep original behavior (split on '/' and use first segment)

verification: All 130 tests passing (previously 129/130). The failing end-to-end test "should generate reports for all packages" now passes successfully.

files_changed: ["packages/api-verifier/src/index.ts"]
