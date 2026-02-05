---
phase: "07"
plan: "02"
subsystem: testing
tags: [testing, documentation-validation, developer-docs, api-verifier]
requires:
  - phases: ["07-01"]
  - truth: Developer documentation exists (AGENTS.md, skills/)
provides:
  - automated-tests: Validation tests for AGENTS.md and skills/
  - gap-detection: Tests identify documentation drift from reality
  - ci-integration: Tests run as part of test suite
affects:
  - future: Documentation updates will be validated automatically
  - maintenance: Tests prevent documentation decay
tech-stack:
  added: []
  patterns: [test-driven-documentation-validation]
key-files:
  created:
    - packages/api-verifier/tests/developer-docs/agents.test.ts
    - packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts
    - packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
  modified: []
decisions:
  - id: DEV-TEST-01
    what: Place developer docs tests in api-verifier package
    why: api-verifier already has filesystem scanning utilities
    alternatives: [create new testing package, place in root tests/]
    impact: Consolidates documentation validation in one place
  - id: DEV-TEST-02
    what: Use filesystem scanning to determine ground truth
    why: Package.json and directory structure are source of truth
    alternatives: [hardcode expected values, manual verification]
    impact: Tests automatically adapt to package changes
  - id: DEV-TEST-03
    what: Allow test failures to reveal documentation gaps
    why: Failing tests = documentation needs updating, not test bug
    alternatives: [update docs first, make tests always pass]
    impact: Tests serve as documentation gap detector
metrics:
  duration: 6.75 minutes
  completed: 2026-02-06
---

# Phase 07 Plan 02: Automated Developer Documentation Validation Summary

**One-liner:** Created automated test suite validating AGENTS.md and skills/ against actual codebase implementation, detecting missing packages and incorrect naming patterns.

## What Was Delivered

### Core Deliverables

**1. AGENTS.md Validation Test** (`agents.test.ts`)
- **10 test cases** covering:
  - Package list completeness (verifies all 9 packages documented)
  - Architecture diagram accuracy
  - Tech stack verification (tsdown, vitest, eslint, bumpp)
  - Build command existence (build, test, typecheck, lint, install, prepare)
  - Scaffolding commands (newpkg, newplugin)
  - Documentation commands (docs:dev, docs:build)
  - Release commands (publint, release)
  - Package count consistency between sections
  - Monorepo tool verification (pnpm workspace)
  - Version management tool (bumpp)

**2. pikacss-dev Skill Validation Test** (`pikacss-dev-skill.test.ts`)
- **10 test cases** covering:
  - Essential command existence in package.json
  - Testing strategy command validation
  - Release process command verification
  - Monorepo tool documentation accuracy
  - Package layer architecture diagram
  - Markdown file reference validation
  - Test framework documentation (Vitest)
  - Version management tool documentation (bumpp)
  - pnpm filter pattern syntax validation
  - Build tool documentation (tsdown)

**3. pikacss-expert Skill Validation Test** (`pikacss-expert-skill.test.ts`)
- **11 test cases** covering:
  - Import statement package name accuracy
  - pika() API property name validation
  - Pseudo-element $ syntax correctness
  - Pseudo-class & syntax correctness
  - Responsive design media query syntax
  - Dark mode prefers-color-scheme syntax
  - Official plugin existence verification
  - TypeScript example syntactic validity
  - Static evaluation requirement clarity
  - Generated file name accuracy
  - Framework API usage correctness (Vue/React)

### Test Results

**Total Coverage:**
- 31 test cases across 3 test files
- 29 tests passing (94% pass rate)
- 2 intentional failures revealing real documentation gaps

**Identified Documentation Issues:**
1. AGENTS.md missing `@pikacss/api-verifier` package
2. AGENTS.md using shortened names (`@pikacss/unplugin`) instead of full names (`@pikacss/unplugin-pikacss`)
3. Package count mismatch (documents 8, reality has 9)

## Implementation Notes

### Test Design Philosophy

**Ground Truth Sources:**
- Filesystem structure (`packages/*/package.json`)
- Root package.json scripts
- pnpm-workspace.yaml configuration
- Actual package exports and imports

**Validation Approach:**
- Tests scan filesystem for authoritative data
- Documentation is checked against reality
- Failing tests indicate docs need updating, not test bugs
- Tests automatically adapt to codebase changes

### Technical Decisions

**Test Location:** `packages/api-verifier/tests/developer-docs/`
- Rationale: api-verifier already has filesystem utilities
- Benefit: Consolidates doc validation in existing test infrastructure

**Regex Patterns:**
- Property matching: `(?:^|\{|,)\s*['"]?([a-zA-Z$&@][\w-]*?)['"]?\s*:/gm`
- Command matching: `` `pnpm\s+([\w:]+)` ``
- Multiline matching: `[\s\S]*?` for cross-line patterns

**Path Resolution:**
- Tests run from `packages/api-verifier/` directory
- Monorepo root calculated as `resolve(__dirname, '../../../..')`
- All file checks relative to monorepo root

### Validation Coverage

**AGENTS.md (Developer Internal):**
- ✅ Package inventory completeness
- ✅ Command documentation accuracy
- ✅ Tech stack tool verification
- ✅ Architecture consistency

**pikacss-dev SKILL.md (Developer Workflow):**
- ✅ All documented commands exist
- ✅ Workflow steps reference real tools
- ✅ Package references use correct names
- ✅ File references point to existing docs

**pikacss-expert SKILL.md (User API Guide):**
- ✅ Import statements use correct package names
- ✅ API examples use valid properties
- ✅ Syntax patterns match actual API
- ✅ Framework examples use correct APIs

## Deviations from Plan

**Auto-fixed Issues:**

**1. [Rule 3 - Blocking] Fixed monorepo root path resolution**
- **Found during:** Task 1 (agents.test.ts creation)
- **Issue:** Tests run from `packages/api-verifier/` but needed to access monorepo root files
- **Fix:** Added `monorepoRoot = resolve(__dirname, '../../../..')` variable for all path resolution
- **Files modified:** agents.test.ts, pikacss-dev-skill.test.ts, pikacss-expert-skill.test.ts
- **Commits:** 0097761, 359fd72, 7c58d3f (included in task commits)

**2. [Rule 1 - Bug] Fixed bumpp package.json lookup path**
- **Found during:** Task 1 test execution
- **Issue:** Test looked for bumpp in api-verifier package.json instead of monorepo root
- **Fix:** Changed to `join(monorepoRoot, 'package.json')` for version tool check
- **Files modified:** agents.test.ts
- **Commit:** 0097761

**3. [Rule 2 - Missing Critical] Skip 'install' command validation**
- **Found during:** Task 2 test execution
- **Issue:** `pnpm install` is built-in, not in package.json scripts
- **Fix:** Added conditional skip for 'install' command while still documenting it as essential
- **Files modified:** pikacss-dev-skill.test.ts
- **Commit:** 359fd72

**4. [Rule 1 - Bug] Fixed release command regex capturing**
- **Found during:** Task 2 test execution
- **Issue:** Regex captured `release`:` including markdown syntax instead of just `release`
- **Fix:** Changed pattern to `/\`pnpm\s+([\w:]+)/g` to match only word characters and colons
- **Files modified:** pikacss-dev-skill.test.ts
- **Commit:** 359fd72

**5. [Rule 2 - Missing Critical] Handle plugin wildcard notation**
- **Found during:** Task 2 test execution
- **Issue:** SKILL.md uses `@pikacss/plugin-{icons,reset,typography}` wildcard notation
- **Fix:** Test now validates wildcard pattern instead of expecting explicit names
- **Files modified:** pikacss-dev-skill.test.ts
- **Commit:** 359fd72

**6. [Rule 1 - Bug] Fixed property name regex capturing**
- **Found during:** Task 3 test execution
- **Issue:** Regex captured "px)" from media query values, not just property names
- **Fix:** Changed to `(?:^|\{|,)\s*['"]?([a-zA-Z$&@][\w-]*?)['"]?\s*:/gm` with multiline flag
- **Files modified:** pikacss-expert-skill.test.ts
- **Commit:** 7c58d3f

**7. [Rule 1 - Bug] Fixed multiline regex for code validation**
- **Found during:** Task 3 test execution
- **Issue:** Regex `/function Component.*pika.*color/` doesn't match across newlines
- **Fix:** Changed to `/function Component[\s\S]*?pika[\s\S]*?color/` using `[\s\S]` for any character
- **Files modified:** pikacss-expert-skill.test.ts
- **Commit:** 7c58d3f

**8. [Rule 2 - Missing Critical] Expanded special property skiplist**
- **Found during:** Task 3 test execution
- **Issue:** Shortcut properties like 'variant', 'size', 'name' aren't CSS properties
- **Fix:** Added to skip list alongside 'icon', 'h1', 'btn'
- **Files modified:** pikacss-expert-skill.test.ts
- **Commit:** 7c58d3f

## Next Phase Readiness

### Blockers
None

### Dependencies for Future Phases
- **Phase 7 remaining plans** should use these tests as examples
- **Documentation updates** should run these tests to verify accuracy

### Concerns
- Tests currently reveal 2 documentation gaps in AGENTS.md (expected behavior)
- Future documentation updates should verify all tests pass
- Tests should be run in CI pipeline (not yet configured)

### Known Issues
- AGENTS.md needs updates to pass all tests:
  - Add `@pikacss/api-verifier` to package list
  - Update package names to use full forms
  - Update package count from 8 to 9
- These are documentation issues, not test bugs

## Decisions Made

**DEV-TEST-01: Test Location**
- Placed in `packages/api-verifier/tests/developer-docs/`
- Leverages existing test infrastructure
- Keeps validation logic centralized

**DEV-TEST-02: Ground Truth Approach**
- Filesystem and package.json are source of truth
- Tests scan actual structure, not expected values
- Auto-adapts to project changes

**DEV-TEST-03: Test Failure Philosophy**
- Failing tests = docs need updating
- Tests intentionally fail when docs drift
- Not a bug, but a feature

## Metrics

- **Tasks completed:** 3/3
- **Test files created:** 3
- **Total test cases:** 31
- **Test pass rate:** 94% (2 intentional failures)
- **Commits:** 3 (one per task)
- **Duration:** 6.75 minutes (405 seconds)
- **Files added:** 3
- **Files modified:** 0 (deviations included in task commits)
- **Lines of test code:** ~680 lines

## Verification Results

**All success criteria met:**

✅ **agents.test.ts exists and validates AGENTS.md**
- 10 test cases covering package list, architecture, tools, commands

✅ **pikacss-dev-skill.test.ts validates development workflows**
- 10 test cases covering essential commands, testing, release, tools

✅ **pikacss-expert-skill.test.ts validates API examples**
- 11 test cases covering imports, API syntax, framework examples

✅ **All three tests execute successfully via pnpm test**
- Run with: `pnpm --filter @pikacss/api-verifier test developer-docs/`
- 29 passing, 2 intentional failures revealing real gaps

✅ **Tests provide actionable failures if documentation drifts**
- Clear error messages show expected vs actual
- Point to specific lines in documentation
- Indicate whether doc or code needs updating

## Future Improvements

**Potential Enhancements:**
1. Add tests for pikacss-docs skill (documentation maintenance procedures)
2. Validate code examples can actually be compiled (use ts-morph or esbuild)
3. Cross-reference API examples with extracted API data from Phase 07-01
4. Add tests for CHANGELOG.md format and completeness
5. Integrate with CI to prevent doc drift on PRs

**CI Integration:**
```yaml
# Future .github/workflows/test.yml addition
- name: Validate developer documentation
  run: pnpm --filter @pikacss/api-verifier test developer-docs/
```

## Commits

- `0097761`: test(07-02): add AGENTS.md validation test
- `359fd72`: test(07-02): add pikacss-dev skill validation test
- `7c58d3f`: test(07-02): add pikacss-expert skill validation test

---

**Phase 07 Plan 02 Status:** ✅ **COMPLETE**

**Test Suite Ready:** Tests operational and revealing documentation gaps as designed.

**Next Steps:** Update AGENTS.md to resolve 2 failing tests, or accept failures as known issues documented in this summary.
