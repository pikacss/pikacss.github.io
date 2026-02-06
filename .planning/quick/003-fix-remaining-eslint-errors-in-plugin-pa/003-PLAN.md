---
phase: quick-003
plan: 003
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/pikacss-dev/references/PLUGIN-PATTERNS.md
autonomous: true

must_haves:
  truths:
    - "ESLint parsing passes for all code blocks in PLUGIN-PATTERNS.md"
    - "pika-module-augmentation rule does not trigger false positives on example code"
    - "Object spread syntax replaced with parseable comment notation"
  artifacts:
    - path: "skills/pikacss-dev/references/PLUGIN-PATTERNS.md"
      provides: "ESLint-compliant plugin pattern examples"
      validation: "pnpm lint passes on this file"
  key_links:
    - from: "PLUGIN-PATTERNS.md code blocks"
      to: "ESLint parser"
      via: "markdown code fence processing"
      pattern: "```typescript"
---

<objective>
Fix 14 ESLint errors in PLUGIN-PATTERNS.md using patterns established in quick-002.

Purpose: Eliminate remaining validation errors after skills directory move to enable clean CI runs
Output: All ESLint parsing errors resolved, pika-module-augmentation false positives suppressed
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/quick/002-fix-run-all-checks-sh-errors/002-SUMMARY.md
@skills/pikacss-dev/references/PLUGIN-PATTERNS.md

## Error Categories (from quick-002 experience)

1. **Object spread syntax** `{ ... }` → `{ /* comment */ }`
   - ESLint parser cannot parse three-dot syntax in educational examples
   - Replace with comment notation

2. **pika-module-augmentation rule** - Plugin missing module augmentation
   - Add `<!-- eslint-disable pikacss/pika-module-augmentation -->` before incomplete plugin examples
   - Used when showing plugin structure without full module augmentation context

3. **Parsing errors** - "Unexpected keyword or identifier"
   - Missing type annotations or context for TypeScript examples
   - Add proper types to resolve parser ambiguity

## Errors to Fix

**File: skills/pikacss-dev/references/PLUGIN-PATTERNS.md**

- Line 26: pika-module-augmentation rule violation (plugin example without augmentation)
- Lines 64, 72, 80, 228, 400: Object spread syntax `{...}` (5 instances)
- Lines 137, 162, 211, 245, 342: Parsing errors "Unexpected keyword or identifier" (5 instances)
- Line 432: Parsing error "Expression expected"
- Lines 442, 466: pika-module-augmentation rule violations (2 more plugin examples)
</context>

<tasks>

<task type="auto">
  <name>Fix ESLint errors in PLUGIN-PATTERNS.md</name>
  <files>skills/pikacss-dev/references/PLUGIN-PATTERNS.md</files>
  <action>
Apply fixes using patterns from quick-002:

**1. Fix pika-module-augmentation false positives (lines 26, 442, 466)**
- Add `<!-- eslint-disable pikacss/pika-module-augmentation -->` before plugin example code blocks that don't show module augmentation
- This prevents false positives when documentation shows plugin structure separately from type declarations

**2. Replace object spread syntax (lines 64, 72, 80, 228, 400)**
- Replace `{...}` with `{ /* shortcut config */ }` or similar descriptive comment
- Replace `{...defs, ...}` with `{ /* merged style definitions */ }`
- Ensure replacement comments accurately describe what the spread represents

**3. Fix parsing errors (lines 137, 162, 211, 245, 342, 432)**
- Add missing type annotations where TypeScript parser needs them
- Ensure function parameters have explicit types
- Add return type annotations if needed for parser disambiguation
- If examples are showing invalid patterns, consider adding eslint-disable for that block

**Pattern reference from quick-002:**
```typescript
// Before: engine.registerShortcut('btn', {...})
// After:  engine.registerShortcut('btn', { /* button shortcut config */ })

// Before: return { ...defs, myCustomProp: value }
// After:  return { /* spread defs */, myCustomProp: value }
```

**Validation approach:**
- Read entire file to understand context
- Identify each error line and determine appropriate fix
- Apply fixes maintaining code example educational value
- Preserve 2-space indentation and project conventions
  </action>
  <verify>
Run ESLint on the file:
```bash
pnpm lint skills/pikacss-dev/references/PLUGIN-PATTERNS.md
```

Expected: 0 errors related to this file, parsing succeeds for all code blocks
  </verify>
  <done>
- All 14 ESLint errors in PLUGIN-PATTERNS.md resolved
- ESLint parsing passes for all TypeScript code blocks
- pika-module-augmentation rule does not trigger false positives
- Educational value of plugin pattern examples preserved
  </done>
</task>

</tasks>

<verification>
1. Run full validation suite: `bash scripts/run-all-checks.sh`
2. Verify ESLint: 0 errors in PLUGIN-PATTERNS.md
3. Verify code examples remain clear and educational
</verification>

<success_criteria>
- ESLint reports 0 errors for skills/pikacss-dev/references/PLUGIN-PATTERNS.md
- All 14 documented errors resolved
- Code examples maintain educational clarity
- Validation scripts pass cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/003-fix-remaining-eslint-errors-in-plugin-pa/003-SUMMARY.md`
</output>
