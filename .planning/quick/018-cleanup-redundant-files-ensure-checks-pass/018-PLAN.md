---
phase: quick
plan: 018
type: execute
wave: 1
depends_on: []
files_modified: [eslint.config.mjs]
autonomous: true
must_haves:
  truths:
    - "Root directory is clean of verification artifacts"
    - "Temporary test directories are removed"
    - "ESLint config no longer ignores moved files"
    - "Project passes linting after cleanup"
  artifacts:
    - path: ".planning/phases/04-core-package-correction-pikacss-core/04-VERIFICATION.md"
      provides: "Archived verification report"
    - path: ".planning/phases/03-api-verification-system/API-VERIFICATION-BASELINE.md"
      provides: "Archived baseline report"
  key_links: []
---

<objective>
Clean up redundant files and organize project structure.
Purpose: Remove clutter from root directory and delete temporary files while preserving history in appropriate locations.
Output: Clean root directory and updated ESLint config.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.gitignore
@eslint.config.mjs
</context>

<tasks>

<task type="auto">
  <name>Task 1: Organize and cleanup files</name>
  <files>eslint.config.mjs</files>
  <action>
    1. Move tracked verification artifacts to their respective phase directories:
       - `git mv 04-VERIFICATION.md .planning/phases/04-core-package-correction-pikacss-core/`
       - `git mv API-VERIFICATION-BASELINE.md .planning/phases/03-api-verification-system/`
    
    2. Remove untracked temporary files and directories:
       - `rm api-verification-report.json api-verification-report.md`
       - `rm -rf packages/vite/.temp/ .temp-test-nuxt-iVaUVl/`
    
    3. Update `eslint.config.mjs` to remove the now-unnecessary ignore rule for `API-VERIFICATION-BASELINE.md`.
  </action>
  <verify>
    Run `ls -F` to confirm root is clean.
    Run `ls .planning/phases/04-core-package-correction-pikacss-core/04-VERIFICATION.md` to confirm move.
    Run `pnpm lint` to ensure no configuration errors or linting issues.
  </verify>
  <done>
    Root directory is clean, files are moved to planning/phases, and lint passes.
  </done>
</task>

</tasks>

<verification>
Verify that `pnpm lint` passes successfully.
Verify that `pnpm test` (optional, but good practice) still works or at least isn't broken by file moves (unlikely for docs).
</verification>

<success_criteria>
- [ ] 04-VERIFICATION.md moved to phase 04 folder
- [ ] API-VERIFICATION-BASELINE.md moved to phase 03 folder
- [ ] Untracked reports and temp folders deleted
- [ ] eslint.config.mjs updated
- [ ] Lint check passes
</success_criteria>

<output>
After completion, create `.planning/quick/018-cleanup-redundant-files-ensure-checks-pass/018-SUMMARY.md`
</output>
