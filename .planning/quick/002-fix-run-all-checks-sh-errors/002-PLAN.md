---
phase: quick-002
plan: 002
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/README.md
  - skills/pikacss-dev/references/ARCHITECTURE.md
autonomous: true

must_haves:
  truths:
    - "run-all-checks.sh completes without ESLint parsing errors"
    - "No broken link warnings for intentional negative examples"
    - "YAML frontmatter examples follow correct syntax"
  artifacts:
    - path: "skills/README.md"
      provides: "Fixed YAML example and disabled link checking for negative examples"
      min_lines: 330
    - path: "skills/pikacss-dev/references/ARCHITECTURE.md"
      provides: "Fixed object spread syntax in code example"
      min_lines: 240
  key_links:
    - from: "skills/README.md"
      to: "ESLint markdown parser"
      via: "valid YAML syntax in code blocks"
      pattern: "name: pikacss-dev"
---

<objective>
Fix three categories of errors in run-all-checks.sh validation:
1. ESLint parsing error from invalid YAML syntax (missing space after colon)
2. ESLint parsing error from object spread syntax in markdown code block
3. Broken link warnings from intentional negative examples

Purpose: Restore validation suite to clean state after skills directory move
Output: All validation checks passing
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

## Background

Quick task 001 moved skills from .github/skills to ./skills. The run-all-checks.sh validation now catches errors that were previously in .github/ (which was not validated).

## Errors Identified

1. **skills/README.md:308** - Invalid YAML in code block:
   ```yaml
   name:pikacss-dev  # ❌ Missing space after colon
   ```

2. **skills/pikacss-dev/references/ARCHITECTURE.md:236** - Object spread syntax:
   ```typescript
   engine.registerShortcut('myShortcut', { ... })  // ESLint can't parse ...
   ```

3. **skills/README.md:315, 318, 324, 327** - Intentional broken links in "Common Pitfalls" section showing what NOT to do. These trigger check-links.sh warnings.

## Validation Evidence

From run-all-checks.sh output (2026-02-06):
- ESLint: 2 parsing errors
- check-links.sh: 4 broken link warnings for negative examples
</context>

<tasks>

<task type="auto">
  <name>Fix ESLint parsing errors in skills documentation</name>
  <files>
    skills/README.md
    skills/pikacss-dev/references/ARCHITECTURE.md
  </files>
  <action>
**Fix 1: Invalid YAML syntax in skills/README.md line 304**

Replace invalid YAML example with correct syntax:
```yaml
# ❌ Wrong
name:pikacss-dev
description:Comprehensive guide
```

With:
```yaml
# ❌ Wrong
name:pikacss-dev  # Missing space after colon
description:Comprehensive guide  # Missing space after colon
```

**Fix 2: Object spread in ARCHITECTURE.md line 236**

Replace:
```typescript
engine.registerShortcut('myShortcut', { ... })
```

With:
```typescript
engine.registerShortcut('myShortcut', { /* shortcut config */ })
```

**Fix 3: Disable link checking for negative examples in skills/README.md**

Add HTML comment before the "Common Pitfalls" section (around line 300):
```markdown
<!-- eslint-disable-next-line markdown/no-broken-links -->
```

This disables link checking for the intentional broken link examples in lines 315, 318, 324, 327.
  </action>
  <verify>
Run validation suite:
```bash
./scripts/run-all-checks.sh
```

Expected output:
- ✅ ESLint: 0 parsing errors (may still have other warnings)
- ✅ check-links.sh: No warnings for skills/README.md negative examples
  </verify>
  <done>
All three error categories resolved:
- YAML example shows correct syntax with explanatory comments
- Object spread replaced with parseable comment syntax
- Intentional broken links in negative examples don't trigger warnings
- run-all-checks.sh completes without ESLint parsing errors
  </done>
</task>

</tasks>

<verification>
## Validation Commands

```bash
# Full validation suite
./scripts/run-all-checks.sh

# Specific checks
pnpm lint skills/README.md skills/pikacss-dev/references/ARCHITECTURE.md
./scripts/check-links.sh
```

## Expected Results

- ESLint markdown parsing: 0 errors
- Link checker: 0 warnings for intentional negative examples
- All skills documentation passes structural validation
</verification>

<success_criteria>
- [ ] run-all-checks.sh completes without ESLint parsing errors
- [ ] YAML example in skills/README.md uses correct syntax with explanatory comments
- [ ] Object spread in ARCHITECTURE.md replaced with ESLint-parseable syntax
- [ ] Intentional broken links in negative examples don't trigger link checker warnings
- [ ] Zero validation regressions introduced
</success_criteria>

<output>
After completion, create `.planning/quick/002-fix-run-all-checks-sh-errors/002-SUMMARY.md`
</output>
