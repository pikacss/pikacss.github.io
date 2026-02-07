---
phase: 09-check-docs-example-code-compliance
plan: 017
type: execute
wave: 1
depends_on: []
files_modified: [scripts/verify-code-rules.ts, docs/**/*.md]
autonomous: true
user_setup: []

must_haves:
  truths:
    - "No example code imports pika() (it is a build-time global)"
    - "No non-ASCII characters in code comments (English only)"
    - "pika() arguments are static (literals/objects only)"
  artifacts:
    - path: "scripts/verify-code-rules.ts"
      provides: "Verification logic for documentation code examples"
  key_links:
    - from: "docs/**/*.md"
      to: "scripts/verify-code-rules.ts"
      via: "manual execution"
---

<objective>
Verify that all code examples in documentation comply with project rules: no `pika()` imports, static arguments only, and English comments.

Purpose: Ensure documentation examples are correct and follow project standards.
Output: A verification script and updated documentation files.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@AGENTS.md
</context>

<tasks>

<task type="auto">
  <name>Create verification script for code examples</name>
  <files>scripts/verify-code-rules.ts</files>
  <action>
    Create a script `scripts/verify-code-rules.ts` that:
    1. Scans all markdown files in `docs/`
    2. Extracts `ts`, `js`, `vue` code blocks
    3. Checks for `import { pika }` (violation)
    4. Checks for non-ASCII characters in comments (violation)
    5. Checks for suspicious dynamic arguments in `pika(...)` calls (heuristic)
    6. Reports file paths and line numbers of violations
  </action>
  <verify>
    Execute the script on the codebase: `npx tsx scripts/verify-code-rules.ts`
  </verify>
  <done>
    Script runs and reports any violations found.
  </done>
</task>

<task type="auto">
  <name>Run verification and fix violations</name>
  <files>docs/**/*.md</files>
  <action>
    1. Run `npx tsx scripts/verify-code-rules.ts`
    2. For each reported violation:
       - Remove `import { pika } ...` if present
       - Translate non-English comments to English
       - Simplifiy dynamic `pika()` arguments to static ones if possible
    3. Re-run verification to confirm fixes
  </action>
  <verify>
    `npx tsx scripts/verify-code-rules.ts` returns 0 exit code (no errors)
  </verify>
  <done>
    All documentation examples comply with project rules.
  </done>
</task>

</tasks>

<verification>
Run `npx tsx scripts/verify-code-rules.ts` and ensure it reports no errors.
</verification>

<success_criteria>
- [ ] No `pika()` imports in docs examples
- [ ] No non-English comments in docs examples
- [ ] `pika()` arguments are static literals/objects
</success_criteria>

<output>
After completion, create `.planning/quick/017-check-docs-example-code-compliance/017-SUMMARY.md`
</output>
