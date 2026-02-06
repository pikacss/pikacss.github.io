---
phase: quick-005
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/pikacss-expert/references/PLUGIN-GUIDE.md
autonomous: true

must_haves:
  truths:
    - "All ESLint parsing errors in PLUGIN-GUIDE.md are resolved"
    - "Educational plugin examples remain clear and functional"
    - "pika-module-augmentation false positives are suppressed"
  artifacts:
    - path: "skills/pikacss-expert/references/PLUGIN-GUIDE.md"
      provides: "ESLint-compliant plugin usage documentation"
      min_lines: 440
  key_links:
    - from: "skills/pikacss-expert/references/PLUGIN-GUIDE.md"
      to: "run-all-checks.sh"
      via: "ESLint validation"
      pattern: "0 errors"
---

<objective>
Fix all 15 ESLint errors in skills/pikacss-expert/references/PLUGIN-GUIDE.md - the LAST file with ESLint errors in the codebase.

**Purpose:** Complete ESLint validation across entire codebase. After this fix, `run-all-checks.sh` should pass with zero errors.

**Output:** Clean PLUGIN-GUIDE.md that passes ESLint parsing with zero errors while maintaining educational value.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

**Previous Quick Tasks:**
- quick-002: Fixed object spread `{...}` syntax by replacing with realistic objects or comments
- quick-003: Fixed PLUGIN-PATTERNS.md (14 errors) using complete defineEnginePlugin() calls and eslint-disable comments
- quick-004: Fixed pikacss-expert SKILL.md by changing `typescript` to `tsx` for JSX and splitting mixed blocks

**Error Categories in PLUGIN-GUIDE.md:**
1. **Parsing errors (7):** Lines 53, 71, 93, 113, 156, 176, 289, 298, 306, 465, 476 - likely object spreads, interface syntax, or generic syntax
2. **pika-module-augmentation warnings (3):** Lines 195, 337, 356 - false positives on educational plugin examples
3. **Mixed spaces/tabs (90 warnings):** Not blocking, but should fix for consistency

**Established Patterns:**
- Replace `{...}` with realistic object literals or `{ /* options */ }`
- Add `<!-- eslint-disable pikacss/pika-module-augmentation -->` before plugin examples
- Ensure TypeScript interface/type syntax is valid within markdown code blocks
- Use complete function bodies, not shorthand that ESLint can't parse
</context>

<tasks>

<task type="auto">
  <name>Fix all ESLint parsing errors and warnings in PLUGIN-GUIDE.md</name>
  <files>skills/pikacss-expert/references/PLUGIN-GUIDE.md</files>
  <action>
Fix all 15 ESLint errors in PLUGIN-GUIDE.md:

**1. Parsing Errors (Lines 53, 71, 93, 113, 156, 176, 289, 298, 306, 465, 476):**
   - Examine each line with parsing error
   - Common causes:
     * Object spread syntax `{...options}` → replace with `...options` or comment
     * Invalid TypeScript interface/type syntax in code blocks
     * Generic type syntax that ESLint can't parse
   - Apply fixes based on error context (similar to quick-002 and quick-003)

**2. pika-module-augmentation False Positives (Lines 195, 337, 356):**
   - Identify code blocks showing plugin examples with options
   - Add ESLint disable comment BEFORE the code fence:
     ```
     <!-- eslint-disable pikacss/pika-module-augmentation -->
     ```
   - Pattern: Educational examples shouldn't trigger production rules

**3. Mixed Spaces/Tabs (90 warnings in lines 253-313):**
   - Normalize indentation to tabs (project standard for code blocks)
   - Focus on the "Creating a Plugin" section (lines 194-251) and "Using Custom Plugin" section (lines 254-272)
   - Ensure consistent indentation throughout code examples

**Strategy:**
1. Read file and identify exact error locations using ESLint output
2. Fix parsing errors first (most critical)
3. Add eslint-disable comments for false positives
4. Normalize indentation (tabs only)
5. Verify all errors resolved with `pnpm lint`

**Expected Outcome:**
- 15 errors → 0 errors
- ~90 warnings → 0 warnings (after indentation fix)
- Educational value maintained
- All plugin examples remain syntactically valid
  </action>
  <verify>
Run ESLint on the file and confirm zero errors:
```bash
pnpm lint skills/pikacss-expert/references/PLUGIN-GUIDE.md
```

Expected output: "✓ 0 problems (0 errors, 0 warnings)"

Run full validation suite:
```bash
bash scripts/run-all-checks.sh
```

Expected: All checks pass with ESLint showing 0 errors across entire codebase
  </verify>
  <done>
- All 15 ESLint errors in PLUGIN-GUIDE.md resolved
- Mixed spaces/tabs warnings eliminated
- Educational plugin examples remain clear with proper syntax
- run-all-checks.sh passes with zero ESLint errors
- This is the LAST ESLint error fix - codebase now 100% ESLint clean
  </done>
</task>

</tasks>

<verification>
**File-Level Verification:**
```bash
# Confirm zero errors in target file
pnpm lint skills/pikacss-expert/references/PLUGIN-GUIDE.md

# Confirm zero errors across entire codebase
pnpm lint

# Run complete validation suite
bash scripts/run-all-checks.sh
```

**Expected Results:**
- PLUGIN-GUIDE.md: 0 errors, 0 warnings
- Codebase-wide: 0 errors, <100 warnings (target achieved)
- All validation checks pass
</verification>

<success_criteria>
**Measurable Outcomes:**
1. ESLint errors in PLUGIN-GUIDE.md: 15 → 0 ✓
2. ESLint warnings in PLUGIN-GUIDE.md: ~90 → 0 ✓
3. Codebase-wide ESLint errors: 0 (maintained) ✓
4. run-all-checks.sh exit code: 0 ✓

**Quality Gates:**
- [ ] All parsing errors resolved
- [ ] pika-module-augmentation false positives suppressed
- [ ] Indentation normalized (tabs only)
- [ ] Educational examples remain syntactically valid
- [ ] No new ESLint errors introduced elsewhere
- [ ] This completes ESLint error elimination across entire codebase
</success_criteria>

<output>
After completion, create `.planning/quick/005-fix-all-remaining-eslint-errors-in-plugi/005-SUMMARY.md`
</output>
