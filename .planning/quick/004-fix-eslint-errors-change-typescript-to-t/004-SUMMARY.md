---
phase: quick-004
plan: 01
subsystem: documentation-quality
tags: [eslint, markdown, code-fences, jsx, vue, parsing]
requires: [quick-002, quick-003]
provides: [eslint-clean-pikacss-expert]
affects: []
tech-stack:
  added: []
  patterns: [separate-code-and-template-blocks]
key-files:
  created: []
  modified:
    - skills/pikacss-expert/SKILL.md
decisions:
  - Split mixed TypeScript/Vue blocks into separate code fences for ESLint compatibility
  - Use tsx for React JSX, vue for Vue template syntax
metrics:
  duration: 148s
  completed: 2026-02-06
---

# Quick Task 004: Fix ESLint Errors in pikacss-expert SKILL.md Summary

**One-liner:** Fixed 4 ESLint parsing errors by changing React JSX blocks to tsx and splitting mixed TypeScript/Vue template blocks into separate code fences

## What Was Done

### Task 1: Fix JSX code block language identifiers ✅

Fixed all ESLint parsing errors in `skills/pikacss-expert/SKILL.md` by:

1. **Changed 2 React JSX blocks from `typescript` to `tsx`**:
   - Line 57: React component with JSX return statement (`<div className={...}>`)
   - Line 76: React component with inline style and className props

2. **Split 2 mixed TypeScript/Vue blocks** into separate code fences:
   - Line 395: Separated TypeScript `pika()` call from Vue template with `:class` and `:style`
   - Line 468: Separated TypeScript `pika()` call from Vue template with `:style`

**Why split instead of tsx:** Vue template attributes (`:class`, `:style`) are not valid TSX syntax. TSX expects React-style `className` and `style` props. Splitting allows TypeScript code to be parsed correctly while Vue templates use the `vue` language identifier.

**Result:** ESLint now parses `skills/pikacss-expert/SKILL.md` with **zero errors** ✅

## Verification Results

✅ **ESLint validation:** Zero parsing errors in target file  
✅ **Change validation:** 4 code fence changes (2 `typescript`→`tsx`, 2 splits with new `vue` blocks)  
✅ **Content preservation:** All code content preserved, only language identifiers changed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Split mixed code blocks instead of simple language change**

- **Found during:** Task 1 implementation
- **Issue:** Plan specified changing lines 395 and 468 from `typescript` to `tsx`, but these blocks contain Vue template syntax (`:class`, `:style`) which is invalid in TSX
- **Fix:** Split each mixed block into two separate code fences:
  - TypeScript block for `pika()` calls (keeping as `typescript` or using `tsx` where appropriate)
  - Vue block for template syntax using `vue` language identifier
- **Files modified:** skills/pikacss-expert/SKILL.md (lines 395-412, 490-501)
- **Commit:** 6607560
- **Rationale:** Vue's `:class` and `:style` directives are not valid in TSX (which expects React's `className` and `style`). Separating the code from the template allows each to be parsed with the appropriate language parser.

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Fix JSX code block language identifiers | 6607560 | skills/pikacss-expert/SKILL.md |

## Technical Notes

### Code Fence Strategy

**React JSX examples:**
- Use `tsx` language identifier
- Valid TSX syntax with `className` and `style` props

**Vue template examples:**
- Use `vue` language identifier for template blocks
- Keep TypeScript code in separate `typescript` or `tsx` blocks
- Prevents ESLint from trying to parse Vue-specific syntax (`:class`, `:style`, `v-if`, etc.) as TypeScript

### Pattern Established

When documenting framework integration examples with mixed code:
1. **Pure React JSX** → `tsx` block
2. **Pure Vue template** → `vue` block  
3. **TypeScript + Vue template** → Separate into `typescript` + `vue` blocks
4. **TypeScript + React JSX** → Single `tsx` block

## Quality Metrics

- **ESLint errors before:** 4 (lines 66, 90, 404, 497)
- **ESLint errors after:** 0 ✅
- **Code blocks modified:** 4 total
  - 2 changed language identifier
  - 2 split into separate blocks
- **Content preservation:** 100% (only fence identifiers and structure changed)

## Next Phase Readiness

**Status:** ✅ Complete

All ESLint parsing errors in `skills/pikacss-expert/SKILL.md` resolved. The pattern of separating TypeScript code from Vue templates can be applied to other files if needed.

**Files ready for validation:**
- skills/pikacss-expert/SKILL.md (zero ESLint errors)

**Known remaining issues:**
- Other files still have ESLint errors (PLUGIN-GUIDE.md, api-reference.md, troubleshooting.md)
- These are outside the scope of quick-004

## Self-Check: PASSED

All commits verified:
✓ 6607560 exists in git log

All modified files verified:
✓ skills/pikacss-expert/SKILL.md modified as expected
