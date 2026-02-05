---
phase: 05-integration-and-framework-layers
plan: 05
subsystem: framework
tags: [nuxt, nuxt-module, vite-plugin, deprecation, zero-config]

# Dependency graph
requires:
  - phase: 05-02
    provides: PluginOptions interface verification
  - phase: 05-03
    provides: Bundler integration guide patterns
provides:
  - Complete Nuxt module documentation with ModuleOptions interface
  - Zero-config setup documentation for Nuxt integration
  - Deprecation notice and migration guide for @pikacss/vite-plugin-pikacss
  - Accurate scan.exclude defaults across all framework docs
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Zero-config framework module pattern (auto CSS injection, auto scanning)
    - Deprecation and migration guide pattern for consolidated packages

key-files:
  created: []
  modified:
    - packages/nuxt/README.md
    - docs/integrations/nuxt.md
    - packages/vite/README.md

key-decisions:
  - "Documented Nuxt module automatic features (CSS injection, Vue scanning, global pika)"
  - "Fixed defineEngineConfig import to @pikacss/core across all Nuxt documentation"
  - "Added complete deprecation notice with migration guide for vite-plugin-pikacss"
  - "Clarified cssCodegen cannot be disabled (type is 'true | string', not 'boolean | string')"

patterns-established:
  - "ModuleOptions extends PluginOptions minus currentPackageName (set automatically)"
  - "Zero-config defaults clearly documented with optional customization"
  - "Deprecation notices include why change was made and complete migration steps"

# Metrics
duration: 4min
completed: 2026-02-05
---

# Phase 5 Plan 5: Nuxt Framework Adapter Documentation Summary

**Zero-config Nuxt module documentation with automatic features and vite-plugin deprecation guide**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-02-05T00:30:00Z
- **Completed:** 2026-02-05T00:34:16Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Corrected packages/nuxt/README.md with accurate ModuleOptions interface documentation
- Fixed docs/integrations/nuxt.md to reflect zero-config setup and automatic features
- Added comprehensive deprecation notice to packages/vite/README.md
- Documented Nuxt module automatic behaviors (CSS injection, Vue scanning, global pika function)
- Fixed scan.exclude default to include 'dist/**' pattern
- Corrected defineEngineConfig import path from @pikacss/core
- Created migration guide with before/after examples for deprecated Vite package

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify and correct Nuxt module documentation** - `88c210b` (docs)
2. **Task 2: Add deprecation notice to @pikacss/vite-plugin-pikacss** - `aa39c62` (docs)

## Files Created/Modified
- `packages/nuxt/README.md` - Added ModuleOptions interface documentation, clarified automatic features, fixed scan.exclude defaults (meets 80+ line requirement)
- `docs/integrations/nuxt.md` - Updated zero-config setup section, corrected defineEngineConfig import, documented automatic CSS injection (meets 100+ line requirement)
- `packages/vite/README.md` - Added prominent deprecation warning, complete migration guide with examples, deprecation timeline (meets 30+ line requirement)

## Decisions Made

**1. Documented Nuxt automatic features explicitly**
- Rationale: Users need to understand they don't need manual CSS import or pika() import - module handles this automatically
- Impact: Prevents confusion about setup requirements

**2. Fixed defineEngineConfig import path**
- Rationale: Function is exported from @pikacss/core, not from @pikacss/nuxt-pikacss
- Impact: Users import from correct package, matches other integration guides

**3. Created comprehensive migration guide for vite-plugin**
- Rationale: Users need clear path to migrate from deprecated package
- Impact: Smooth transition to unified unplugin architecture

**4. Clarified cssCodegen type constraint**
- Rationale: Unlike tsCodegen, cssCodegen cannot be false - type is 'true | string'
- Impact: Accurate documentation prevents invalid configurations

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all documentation corrections completed smoothly.

## Next Phase Readiness

- Phase 5 complete: All integration and framework layer documentation verified
- Ready for Phase 6 (Plugin System Correction)
- All bundler integrations (Vite, Webpack, Rspack, Esbuild, Rollup, Farm, Rolldown) documented
- Nuxt module provides zero-config reference for other framework adapters
- Deprecation pattern established for package consolidation

**No blockers identified.**

---
*Phase: 05-integration-and-framework-layers*
*Completed: 2026-02-05*
