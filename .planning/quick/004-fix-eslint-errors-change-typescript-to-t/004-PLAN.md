---
phase: quick-004
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/pikacss-expert/SKILL.md
autonomous: true

must_haves:
  truths:
    - "All TypeScript code blocks with JSX syntax use tsx language identifier"
    - "ESLint parsing passes with zero errors in pikacss-expert/SKILL.md"
  artifacts:
    - path: "skills/pikacss-expert/SKILL.md"
      provides: "Corrected code fence language identifiers"
      min_lines: 600
  key_links:
    - from: "ESLint markdown parser"
      to: "skills/pikacss-expert/SKILL.md code blocks"
      via: "language identifier detection"
      pattern: "```(typescript|tsx)"
---

<objective>
Fix 4 ESLint parsing errors in skills/pikacss-expert/SKILL.md by changing `typescript` to `tsx` for code blocks containing JSX syntax.

Purpose: Enable ESLint to correctly parse TypeScript code blocks with JSX elements (React/Vue component syntax).
Output: Zero ESLint parsing errors in pikacss-expert skill documentation.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md

## Error Context

ESLint markdown parser encounters 4 parsing errors at lines 66, 90, 404, 497:
- Lines 66, 90: JSX elements in React component examples
- Line 404: Vue template JSX-like syntax (`:class` attribute)
- Line 497: Vue template JSX-like syntax (`:style` attribute)

All errors caused by code blocks marked as ```typescript containing JSX, which requires ```tsx.

## Pattern from Previous Quick Tasks

Quick tasks 002 and 003 established pattern for fixing ESLint parsing issues in skills documentation:
- Identify code blocks with JSX syntax
- Change language identifier from `typescript` to `tsx`
- Preserve all code content unchanged
</context>

<tasks>

<task type="auto">
  <name>Fix JSX code block language identifiers</name>
  <files>skills/pikacss-expert/SKILL.md</files>
  <action>
Change code fence language from `typescript` to `tsx` for exactly 4 code blocks:

1. **Line 57** - React component example with JSX return statement (line 66: `<div className={...}>`)
   - Change: ```typescript → ```tsx

2. **Line 76** - Vue component pattern with JSX syntax (line 90: `<div style={...}>`)
   - Change: ```typescript → ```tsx

3. **Line 395** - Vue button example with JSX template attributes (line 404: `<button :class=...>`)
   - Change: ```typescript → ```tsx

4. **Line 468** - Vue component with JSX template syntax (line 497: `<div :style=...>`)
   - Change: ```typescript → ```tsx

**Critical constraints:**
- Only change the code fence language identifier (```typescript to ```tsx)
- Do NOT modify any code content inside the blocks
- Do NOT change other typescript blocks without JSX
- Preserve all formatting, indentation, and comments

**Why these specific blocks:**
Each block contains JSX or JSX-like syntax that requires TypeScript's JSX parser:
- `<Component>` tags
- JSX attributes (`:class`, `:style`, `className`)
- JSX expressions inside tags
  </action>
  <verify>
Run ESLint and confirm zero parsing errors:
```bash
pnpm lint skills/pikacss-expert/SKILL.md
```

Expected: No "Parsing error" messages for lines 66, 90, 404, 497.
  </verify>
  <done>
- All 4 targeted code blocks changed from ```typescript to ```tsx
- ESLint parses skills/pikacss-expert/SKILL.md with zero errors
- All code content preserved exactly (only fence identifiers changed)
  </done>
</task>

</tasks>

<verification>
1. **ESLint validation:**
   ```bash
   pnpm lint skills/pikacss-expert/SKILL.md
   ```
   Expected: Exit code 0, no parsing errors

2. **Change validation:**
   ```bash
   git diff skills/pikacss-expert/SKILL.md
   ```
   Expected: Exactly 4 lines changed, all showing `typescript` → `tsx`

3. **Content preservation:**
   Verify no code content modified (only fence identifiers)
</verification>

<success_criteria>
- [ ] 4 code blocks changed from ```typescript to ```tsx
- [ ] ESLint parsing passes with zero errors
- [ ] No code content modified (only language identifiers)
- [ ] Changes committed with conventional commit message
</success_criteria>

<output>
After completion, create `.planning/quick/004-fix-eslint-errors-change-typescript-to-t/004-SUMMARY.md`
</output>
