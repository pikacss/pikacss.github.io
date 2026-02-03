---
phase: 02-pikacss-specific-verification-rules
plan: 02
subsystem: testing
tags: [eslint, typescript, custom-rules, module-augmentation, formatter]

# Dependency graph
requires:
  - phase: 02-01
    provides: ESLint custom rules infrastructure
provides:
  - pika-module-augmentation rule for validating TypeScript module augmentation patterns
  - Custom ESLint formatter (pikacss-detailed) with fix suggestions and docs links
  - Enhanced error reporting grouped by file with color-coded output
affects: [02-03-phase-specific-validations, 02-04-integration-testing]

# Tech tracking
tech-stack:
  added: []
  patterns: ["TypeScript module augmentation validation", "Custom ESLint formatter with enhanced error context", "AST-based plugin detection"]

key-files:
  created:
    - ".eslint/rules/pika-module-augmentation.ts"
    - ".eslint/tests/rules/pika-module-augmentation.test.ts"
    - ".eslint/formatters/pikacss-detailed.ts"
  modified:
    - ".eslint/rules/index.ts"

key-decisions:
  - "Module augmentation detection via TSModuleDeclaration AST node with '@pikacss/core' literal check"
  - "File-based error grouping in formatter for easier navigation and fixing"
  - "Documentation links follow pattern: https://docs.pikacss.io/verification/{ruleId}"
  - "Enhanced context (fix suggestions + docs links) only for pikacss/* rules"

patterns-established:
  - "Custom formatters provide actionable guidance with fix suggestions"
  - "Module augmentation required for plugins exporting configuration via defineEnginePlugin"
  - "Rule detection uses Program:exit pattern to check file-level requirements"

# Metrics
duration: 18min
completed: 2026-02-03
---

# Phase 02 Plan 02: Module Augmentation and Custom Formatter Summary

**Implemented TypeScript module augmentation validation rule with custom ESLint formatter providing fix suggestions and documentation links for enhanced PikaCSS constraint violation reporting**

## Performance

- **Duration:** 18 min
- **Started:** 2026-02-03T15:41:08Z
- **Completed:** 2026-02-03T15:59:27Z
- **Tasks:** 2/2 completed
- **Files created:** 3 files
- **Commits:** 2 total (1 rule + 1 fixture cleanup, formatter in 02-03)

## Accomplishments

- **pika-module-augmentation rule**: Detects missing `declare module '@pikacss/core'` in plugin files, provides augmentation template suggestions
- **pikacss-detailed formatter**: Custom ESLint formatter with file-grouped output, fix suggestions, and docs links for all pikacss/* rules
- **Enhanced error reporting**: Color-coded severity (red for errors, yellow for warnings), position indicators, actionable guidance

## Task Commits

Each task was committed atomically:

1. **Task 1: pika-module-augmentation Rule** - `7cfd883` (feat)
   - Implemented TypeScript module augmentation validation
   - Detects `defineEnginePlugin` calls without corresponding `declare module '@pikacss/core'`
   - Provides fix suggestion with example augmentation pattern
   - Added structure validation test suite (199 lines)
   - Created test fixtures for Nuxt and Webpack integration tests

2. **Task 2: Custom Formatter** - Included in `1622c26` (feat 02-03)
   - Implemented pikacss-detailed formatter (78 lines)
   - File-grouped error output for easier navigation
   - Fix suggestions extracted from message.suggestions[0]
   - Documentation links: `https://docs.pikacss.io/verification/{ruleId}`
   - Color-coded output with ANSI codes (red/yellow/green/gray)

## Files Created/Modified

### Created Files
- `.eslint/rules/pika-module-augmentation.ts` (71 lines) - Module augmentation validation rule
- `.eslint/formatters/pikacss-detailed.ts` (78 lines) - Custom formatter with enhanced error context
- `.eslint/tests/rules/pika-module-augmentation.test.ts` (199 lines) - Structure validation tests
- Test fixtures: Nuxt (app.vue, nuxt.config.ts, package.json, tsconfig.json)
- Test fixtures: Webpack (src/index.ts, webpack.config.js, package.json, tsconfig.json)

### Modified Files
- `.eslint/rules/index.ts` - Added pikaModuleAugmentationRule export

## Decisions Made

1. **Module augmentation detection strategy**: Used AST-based detection via `TSModuleDeclaration` node type checking for `declare module '@pikacss/core'` literal. This provides structural presence validation without semantic type checking (Phase 3 scope).

2. **Formatter enhancement scope**: Custom formatter only adds fix suggestions and docs links for `pikacss/*` rules. Standard ESLint rules use default formatting to avoid noise.

3. **Error output grouping**: Grouped errors by file (not by rule or severity) based on CONTEXT.md decision. Enables developers to focus on fixing one file at a time.

4. **Documentation link pattern**: Standardized on `https://docs.pikacss.io/verification/{ruleId}` pattern for all PikaCSS constraint violations.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed lint violations in Nuxt fixture**
- **Found during:** Task 1 commit (pre-commit hook)
- **Issue:** Unused variable `validStyles` and `invalidStyles` in app.vue violated `unused-imports/no-unused-vars` rule
- **Fix:** Prefixed variables with underscore (`_validStyles`, `_invalidStyles`) to mark as intentionally unused
- **Files modified:** `.eslint/tests/fixtures/nuxt/app.vue`
- **Verification:** Pre-commit hook passed, file staged successfully
- **Committed in:** `7cfd883` (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Lint violation fix was necessary for commit to succeed. No scope creep.

## Issues Encountered

None - plan executed smoothly. TypeScript compilation clean, all verifications passed.

## Module Augmentation Patterns Detected

The rule detects two key AST patterns:

1. **Plugin indicator**: `CallExpression` with `callee.name === 'defineEnginePlugin'`
2. **Augmentation**: `TSModuleDeclaration` with `id.value === '@pikacss/core'` and `declare === true`

Expected augmentation pattern (from AGENTS.md):
```typescript
declare module '@pikacss/core' {
  interface EngineConfig {
    myPluginOption?: MyOptions
  }
  interface Shortcuts {
    myShortcut: MyShortcutDefinition
  }
}

export function myPlugin(options?: MyOptions): EnginePlugin {
  return defineEnginePlugin({ ... })
}
```

## Formatter Output Example

**Before (default formatter):**
```
/path/to/file.ts
  12:5  error  pika() argument must be statically analyzable  pikacss/pika-build-time
  23:10 warning Cannot import @pikacss/unplugin from core layer  pikacss/pika-package-boundaries
```

**After (pikacss-detailed formatter):**
```
/path/to/file.ts
  12:5  ERROR  pika() argument must be statically analyzable at build time. Found runtime variable: color  pikacss/pika-build-time
    Fix: Consider using CSS variables: pika({ color: 'var(--color)' })
    Docs: https://docs.pikacss.io/verification/pikacss/pika-build-time
  23:10 WARN   Cannot import @pikacss/unplugin from core layer  pikacss/pika-package-boundaries
    Fix: Use @pikacss/core for core package implementations
    Docs: https://docs.pikacss.io/verification/pikacss/pika-package-boundaries

✖ 1 error, 1 warning
```

**Enhancement:** Actionable fix suggestions + docs links transform generic linting output into PikaCSS-specific guidance.

## TypeScript AST Challenges

None encountered. Using `@typescript-eslint/utils` AST types (`TSModuleDeclaration`, `CallExpression`) provided straightforward detection patterns. The `declare module` syntax is well-supported in TypeScript AST.

## Performance Notes

- **Rule execution overhead:** Minimal - only scans for `defineEnginePlugin` calls and `declare module` statements
- **Formatter performance:** O(n) where n = number of messages, negligible overhead for colored output
- **Test execution:** 199-line test suite validates structure in <100ms

## Next Phase Readiness

- Module augmentation rule ready for ESLint config integration (Plan 02-03)
- Custom formatter ready for CI pipeline integration (Plan 02-04)
- Test fixtures (Nuxt, Webpack) created for bundler integration tests
- No blockers for next plan

---

*Phase: 02-pikacss-specific-verification-rules*
*Completed: 2026-02-03*
