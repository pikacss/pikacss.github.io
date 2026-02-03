---
phase: 01-foundation-verification-infrastructure
plan: 02
subsystem: testing
tags: [validation, bash, scripts, link-checking, file-validation]

# Dependency graph
requires:
  - phase: 01-foundation-verification-infrastructure
    provides: ESLint markdown validation enabled (01-01)
provides:
  - Internal markdown link validation script (checks file and anchor links)
  - File reference validation script (validates file:line patterns)
  - Placeholder detection script (finds TODO/TBD/FIXME markers)
affects: [01-foundation-verification-infrastructure]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Bash validation scripts using temp files to avoid nested loop issues"]

key-files:
  created:
    - scripts/check-links.sh
    - scripts/check-file-refs.sh
    - scripts/check-placeholders.sh
  modified: []

key-decisions:
  - "Used temp file approach to avoid bash nested loop issues on macOS"
  - "Simplified file:line pattern to match only common file extensions"
  - "Excluded .planning/** directory from all validation checks"

patterns-established:
  - "All validation scripts exit with non-zero on failures (CI-friendly)"
  - "Consistent output format: file:line: message"
  - "Color-coded output for readability (red for errors, green for success, yellow for warnings)"

# Metrics
duration: 9min
completed: 2026-02-03
---

# Phase 01 Plan 02: Validation Scripts Summary

**Three bash scripts created for structural validation: link checking, file reference validation, and placeholder detection**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-03T13:43:46Z
- **Completed:** 2026-02-03T13:53:20Z
- **Tasks:** 3
- **Files modified:** 3 (all created)

## Accomplishments

- Created `check-links.sh`: validates internal markdown links and anchors
- Created `check-file-refs.sh`: validates file:line code references  
- Created `check-placeholders.sh`: detects placeholder markers (TODO/FIXME/TBD/etc.)
- All scripts exclude `.planning/**` directory
- All scripts are executable and CI-ready (exit non-zero on failures)

## Task Commits

1. **Task 1: Create internal link validation script** - `32c36af` (feat)
2. **Task 2: Create file reference validator** - `61dfe4f` (feat)
3. **Task 3: Create placeholder detection script** - `96af3c0` (feat)

## Files Created/Modified

- `scripts/check-links.sh` - Validates internal markdown links (both file and anchor links)
- `scripts/check-file-refs.sh` - Validates file:line code references in markdown
- `scripts/check-placeholders.sh` - Detects placeholder content (TODO, FIXME, etc.)

## Decisions Made

1. **Used temp file approach for grep results** - macOS bash has issues with nested while loops reading from process substitution. Using temporary files avoids these issues and makes scripts more portable.

2. **Simplified file:line pattern matching** - Initially tried to match all possible file:line patterns but this was too broad and matched URLs (e.g., `http://example.com:8080`). Simplified to only match common file extensions (`.ts`, `.js`, `.md`, etc.) for higher accuracy.

3. **Excluded .planning/** from all checks** - Planning documentation is separate from project documentation and doesn't need the same validation rules.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed nested while loop issue in bash scripts**
- **Found during:** Task 2 and Task 3 (check-file-refs.sh and check-placeholders.sh)
- **Issue:** Nested while loops with process substitution hung indefinitely on macOS bash. The pattern `while read ... < <(grep ...)` inside another `while read ... < <(find ...)` caused the scripts to hang without output.
- **Fix:** Refactored to use temporary files: `find ... -exec grep ... > $TEMP_FILE`, then `while read < $TEMP_FILE`. This avoids nested process substitution and works reliably across platforms.
- **Files modified:** scripts/check-file-refs.sh, scripts/check-placeholders.sh
- **Verification:** All scripts now complete in <5 seconds on 73 markdown files
- **Committed in:** 61dfe4f, 96af3c0 (part of task commits)

---

**Total deviations:** 1 auto-fixed (blocking issue)
**Impact on plan:** Fix was necessary for scripts to function. No scope creep.

## Issues Encountered

**Bash nested loop incompatibility on macOS:**

The initial implementation used nested while loops with process substitution:
```bash
find ... | while read file; do
  grep ... "$file" | while read line; do
    # process line
  done
done
```

This pattern hung indefinitely on macOS bash (version 3.2.57). After investigation and multiple iterations, discovered that macOS bash has known issues with nested process substitution in pipes.

**Solution:** Refactored to use temporary files as an intermediate buffer, which is more portable and reliable. This added `mktemp` usage and `trap` cleanup but significantly improved reliability.

## Initial Run Results

Validation scripts successfully identified issues in current codebase:

### check-links.sh
- **Status:** Identified broken internal links
- **Sample findings:** 
  - `docs/guide/basics.md:14`: Broken link to '/guide/important-concepts'
  - Multiple broken links in docs/guide/basics.md (references to non-existent files)
- **Total:** Multiple broken links detected (exact count deferred to CI integration in 01-03)

### check-file-refs.sh
- **Status:** No file:line references found
- **Result:** ✓ All file:line references are valid (zero references in current documentation)
- **Note:** Script works correctly but current docs don't contain file:line patterns

### check-placeholders.sh
- **Status:** Found 11 placeholder markers
- **Sample findings:**
  - `docs/advanced/architecture.md:164`: "Selector Placeholder"
  - `docs/community/ecosystem.md:70`: "Coming soon! Official starter templates"
  - `docs/community/ecosystem.md:128`: "Coming soon! Official component library"
- **Total:** 11 placeholders detected across documentation

## Next Phase Readiness

**Ready to proceed with Plan 01-03:**
- CI integration of validation scripts
- Establish quality baseline metrics
- Document current state for tracking improvements

**Foundation complete:**
- Three validation scripts operational
- All scripts tested on current codebase
- Baseline issues identified

**No blockers identified.**

---
*Phase: 01-foundation-verification-infrastructure*
*Completed: 2026-02-03*
