---
phase: quick-006
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/pikacss-expert/references/api-reference.md
  - skills/pikacss-expert/references/troubleshooting.md
autonomous: true

must_haves:
  truths:
    - "ESLint parses both files without errors"
    - "All JSX syntax uses tsx language identifier"
    - "All incomplete syntax replaced with complete code"
    - "Mixed spaces/tabs warnings eliminated"
    - "Codebase-wide ESLint error count reaches 0"
  artifacts:
    - path: "skills/pikacss-expert/references/api-reference.md"
      provides: "ESLint-clean API reference"
      validation: "eslint command exits 0 for this file"
    - path: "skills/pikacss-expert/references/troubleshooting.md"
      provides: "ESLint-clean troubleshooting guide"
      validation: "eslint command exits 0 for this file"
  key_links:
    - from: "Both markdown files"
      to: "ESLint parser"
      via: "Code block language identifiers"
      pattern: "```(typescript|tsx|vue|text)"
---

<objective>
Fix the ABSOLUTE FINAL 2 files with ESLint errors in the PikaCSS codebase.

**Purpose:** Achieve 100% ESLint compliance across all 73 markdown files, completing the documentation correction project with zero parsing errors.

**Output:** Two clean files, zero ESLint errors codebase-wide, run-all-checks.sh passing completely.

**Context:** After 5 quick tasks fixing 90+ ESLint errors across skills/, only 2 files remain: api-reference.md (1 error) and troubleshooting.md (7 errors + 2 warnings). This task achieves total ESLint clean state.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@AGENTS.md

# Prior quick task patterns (002-005)
- Change `typescript` to `tsx` for JSX code (React components with `<tag>` syntax)
- Replace `{...}` with realistic literals like `{ backgroundColor: '#000' }` or `{ /* config */ }`
- Fix mixed spaces/tabs (use consistent spaces)
- Add `/* eslint-disable */` for false positives
- Replace incomplete syntax with complete function calls
</context>

<tasks>

<task type="auto">
  <name>Fix api-reference.md line 194 expression error</name>
  <files>skills/pikacss-expert/references/api-reference.md</files>
  <action>
Fix parsing error at line 194 in api-reference.md:

**Error:** "Expression expected" in typescript code block at line 194: `engine.registerShortcut('btn', { ...{} })`

**Fix:** Replace incomplete `{ ...{} }` syntax with realistic object literal:
```typescript
engine.shortcuts.add('btn', { backgroundColor: '#3b82f6', color: 'white' })
```

Note: Also correct API from hallucinated `engine.registerShortcut()` to actual `engine.shortcuts.add()` per AGENTS.md decision #146 and quick-005 established pattern.

**Verification:** Run `pnpm eslint skills/pikacss-expert/references/api-reference.md` - must exit 0
  </action>
  <verify>pnpm eslint skills/pikacss-expert/references/api-reference.md</verify>
  <done>api-reference.md has zero ESLint errors</done>
</task>

<task type="auto">
  <name>Fix troubleshooting.md JSX and syntax errors</name>
  <files>skills/pikacss-expert/references/troubleshooting.md</files>
  <action>
Fix 7 parsing errors + 2 warnings in troubleshooting.md:

**JSX Parsing Errors (lines 71, 93, 113, 465):**
Change language identifier from `typescript` to `tsx` for all code blocks containing JSX syntax:
- Line 68-81: React Button component with JSX `<button>` tag
- Line 88-114: React Button component with JSX `<button>` tag  
- Line 108-115: React component with JSX `<button>` tag
- Line 462-467: React component with JSX `<div>` tag

**Type Syntax Error (line 156):**
Line 156 "'>' expected" - likely incomplete JSX in example. Change to tsx or fix syntax.

**Incomplete API Error (line 104):**
Replace hallucinated `engine.registerShortcut()` with correct `engine.shortcuts.add()` API (per AGENTS.md decision).

**Identifier Error (line 176):**
Line 176 "Unexpected keyword or identifier" - likely incomplete code. Replace with complete function definition or add eslint-disable.

**Object Spread Error (line 476):**
Line 476 "',' expected" - likely `{ ...{} }` pattern or incomplete object. Replace with realistic literal like `{ '--primary': color }` (context shows CSS variable example).

**Mixed Spaces/Tabs (lines 378, 383):**
Convert all tabs to spaces for consistency. Apply project's standard indentation.

**Verification:** Run `pnpm eslint skills/pikacss-expert/references/troubleshooting.md` - must exit 0
  </action>
  <verify>pnpm eslint skills/pikacss-expert/references/troubleshooting.md</verify>
  <done>troubleshooting.md has zero ESLint errors and warnings</done>
</task>

<task type="auto">
  <name>Verify complete codebase ESLint clean state</name>
  <files>N/A</files>
  <action>
Run comprehensive ESLint validation to confirm ZERO errors across entire codebase:

1. Run targeted check: `pnpm eslint skills/pikacss-expert/references/*.md`
2. Run full validation: `pnpm lint` (entire codebase)
3. Verify error count is 0 in output
4. Run unified validator: `./scripts/run-all-checks.sh`

Expected results:
- api-reference.md: 0 errors
- troubleshooting.md: 0 errors  
- Codebase-wide: 0 errors (warnings acceptable if <100)
- run-all-checks.sh: All checks passing

Document final error count in task completion notes.
  </action>
  <verify>pnpm lint && ./scripts/run-all-checks.sh</verify>
  <done>Codebase has zero ESLint errors, all validation scripts passing</done>
</task>

</tasks>

<verification>
**Critical Success Criteria:**

1. **Zero Parsing Errors:**
   - api-reference.md: 0 errors
   - troubleshooting.md: 0 errors
   - Codebase total: 0 errors

2. **Code Quality:**
   - All JSX uses `tsx` language identifier
   - All incomplete syntax replaced with realistic code
   - All hallucinated APIs corrected to actual implementation
   - No mixed spaces/tabs warnings

3. **Integration:**
   - `pnpm lint` exits with code 0
   - `./scripts/run-all-checks.sh` passes completely
   - No regression in previously fixed files

**Testing Commands:**
```bash
# Individual files
pnpm eslint skills/pikacss-expert/references/api-reference.md
pnpm eslint skills/pikacss-expert/references/troubleshooting.md

# Full codebase
pnpm lint

# Unified validation
./scripts/run-all-checks.sh
```

**Expected Output:**
```
✓ ESLint validation: 0 errors (warnings acceptable)
✓ Link validation: passing
✓ Placeholder validation: passing
✓ PikaCSS validation: passing
```
</verification>

<success_criteria>
- [ ] api-reference.md: Line 194 expression error fixed
- [ ] troubleshooting.md: All 7 parsing errors fixed
- [ ] troubleshooting.md: 2 mixed spaces/tabs warnings fixed
- [ ] Both files pass individual ESLint check
- [ ] Codebase-wide ESLint error count = 0
- [ ] run-all-checks.sh passes completely
- [ ] No regression in quick tasks 001-005 fixes
- [ ] Documentation correction project achieves 100% ESLint compliance
</success_criteria>

<output>
After completion, create `.planning/quick/006-fix-final-eslint-errors-in-api-reference/006-SUMMARY.md` documenting:
- Exact errors fixed in each file
- Patterns applied (tsx, API correction, syntax completion)
- Final ESLint error count (before/after)
- Verification results from run-all-checks.sh
- Total quick task series impact (001-006)
</output>
