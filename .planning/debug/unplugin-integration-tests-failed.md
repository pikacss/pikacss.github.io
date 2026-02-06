---
status: diagnosed
trigger: "Integration tests failed in unplugin package"
created: 2026-02-06T00:00:00Z
updated: 2026-02-06T09:45:00Z
---

## Current Focus

hypothesis: CONFIRMED - User confusion about test location and execution command
test: Complete - root cause identified
expecting: N/A - diagnosis phase complete
next_action: Return structured diagnosis

## Symptoms

expected: Integration tests for Vite, Nuxt, Webpack should pass
actual: User reports "Integration tests failed with exit code 1" when running `pnpm --filter @pikacss/unplugin-pikacss test`
errors: Exit code 1 from test command
reproduction: Run `pnpm --filter @pikacss/unplugin-pikacss test`
started: Reported in UAT document (.planning/ALL-PHASES-UAT.md line 48)

## Eliminated

- hypothesis: Tests are actually failing due to code regression
  evidence: Running integration tests with correct command shows all 22 tests pass
  timestamp: 2026-02-06T09:43:00Z

- hypothesis: Integration tests are in packages/unplugin/tests/
  evidence: Integration tests are in .eslint/tests/integration/bundlers.test.ts, not in unplugin package
  timestamp: 2026-02-06T09:35:00Z

## Evidence

- timestamp: 2026-02-06T09:32:00Z
  checked: packages/unplugin/tests/
  found: Only 1 test file (unplugin.test.ts) with 4 basic unit tests, all passing
  implication: The unplugin package has no integration tests - they're elsewhere

- timestamp: 2026-02-06T09:35:00Z
  checked: .eslint/tests/integration/
  found: bundlers.test.ts exists with Vite, Nuxt, Webpack integration tests
  implication: Integration tests are in .eslint directory, not in unplugin package

- timestamp: 2026-02-06T09:38:00Z
  checked: vitest.config.eslint.ts
  found: Separate config for ESLint integration tests with include: ['.eslint/tests/**/*.test.ts']
  implication: Integration tests require special vitest config to run

- timestamp: 2026-02-06T09:43:00Z
  checked: pnpm vitest run --config vitest.config.eslint.ts
  found: All 22 tests pass (4 integration tests + 18 ESLint rule tests) in 43.21s
  implication: Integration tests are working correctly when run with correct command

- timestamp: 2026-02-06T09:43:00Z
  checked: .planning/ALL-PHASES-UAT.md
  found: Test #8 expects `pnpm --filter @pikacss/unplugin-pikacss test` to run integration tests
  implication: UAT document has incorrect expectation about test location/command

## Resolution

root_cause: UAT documentation incorrectly expects integration tests to be in packages/unplugin, when they actually exist in .eslint/tests/integration/ and require a different test command (vitest with eslint config)
fix: Update documentation to use correct test command: `pnpm vitest run --config vitest.config.eslint.ts` or create npm script alias
verification: Integration tests pass successfully (22/22) when run with correct command
files_changed: []
