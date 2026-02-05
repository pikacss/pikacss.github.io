---
phase: 05-integration-and-framework-layers
plan: 03
subsystem: documentation
tags: [vite, webpack, rspack, esbuild, unplugin, integration-guides]

# Dependency graph
requires:
  - phase: 05-02
    provides: Verified PluginOptions interface for unplugin package
provides:
  - Accurate Vite integration guide with correct unplugin imports
  - Accurate Webpack integration guide with Webpack-compatible patterns
  - Accurate Rspack integration guide with Webpack-compatible patterns
  - Accurate Esbuild integration guide with correct plugin usage
affects: [05-04, 05-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "defineEngineConfig imported from @pikacss/core, not unplugin"
    - "scan.exclude defaults to ['node_modules/**', 'dist/**']"
    - "cssCodegen is 'true | string', cannot be disabled"

key-files:
  created: []
  modified:
    - docs/integrations/vite.md
    - docs/integrations/webpack.md
    - docs/integrations/rspack.md
    - docs/integrations/esbuild.md

key-decisions:
  - "Fixed defineEngineConfig import source to @pikacss/core across all guides"
  - "Added dist/** to scan.exclude default to match implementation"
  - "Clarified PluginOptions comments with defaults and type constraints"

patterns-established:
  - "Consistent PluginOptions documentation across all bundler guides"
  - "Bundler-specific import patterns verified against source files"

# Metrics
duration: 3 min
completed: 2026-02-05
---

# Phase 05 Plan 03: Bundler Integration Guides Summary

**Corrected four primary bundler integration guides (Vite, Webpack, Rspack, Esbuild) to match verified unplugin API from Phase 05-02**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-05T00:21:20Z
- **Completed:** 2026-02-05T00:23:53Z
- **Tasks:** 2/2
- **Files modified:** 4

## Accomplishments

- Fixed `defineEngineConfig` import path from `@pikacss/unplugin-pikacss` to `@pikacss/core` in all four guides
- Added `dist/**` to `scan.exclude` default values to match implementation
- Clarified PluginOptions comments with accurate defaults and type constraints
- Verified bundler-specific import patterns against unplugin source files

## Task Commits

Each task was committed atomically:

1. **Task 1: Correct Vite integration guide** - `55d6ad6` (docs)
2. **Task 2: Correct Webpack, Rspack, Esbuild integration guides** - `ee38d09` (docs)

## Files Created/Modified

- `docs/integrations/vite.md` - Fixed defineEngineConfig import, updated scan.exclude default, clarified PluginOptions
- `docs/integrations/webpack.md` - Fixed defineEngineConfig import, updated scan.exclude default, clarified PluginOptions
- `docs/integrations/rspack.md` - Fixed defineEngineConfig import, updated scan.exclude default, clarified PluginOptions
- `docs/integrations/esbuild.md` - Fixed defineEngineConfig import, updated scan.exclude default, clarified PluginOptions

## Decisions Made

**Fixed defineEngineConfig import source:**
Corrected all integration guides to import `defineEngineConfig` from `@pikacss/core` instead of `@pikacss/unplugin-pikacss`. The unplugin package does not re-export this function - it's a core engine function.

**Updated scan.exclude defaults:**
Added `dist/**` to the default exclude patterns to match the actual implementation documented in packages/unplugin/README.md from Phase 05-02.

**Clarified PluginOptions documentation:**
Added comments explaining defaults, type constraints (e.g., cssCodegen cannot be false), and option purposes to improve user understanding.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

Ready for Phase 05-04 (Farm and Rolldown integration guides). All four primary bundler guides now accurately reflect the verified PluginOptions from Phase 05-02.

---
*Phase: 05-integration-and-framework-layers*
*Completed: 2026-02-05*
