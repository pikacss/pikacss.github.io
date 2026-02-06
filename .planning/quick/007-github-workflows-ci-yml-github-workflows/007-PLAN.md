---
task: quick-007
type: execute
objective: "Run and fix GitHub CI workflows locally"
---

<objective>
Test and fix both GitHub Actions workflows (.github/workflows/ci.yml and docs-validation.yml) locally to ensure they pass completely before running in CI.

Purpose: Prevent CI failures by catching and fixing issues locally
Output: Both workflows passing all checks locally with fixes committed
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.github/workflows/ci.yml
@.github/workflows/docs-validation.yml
@package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Run ci.yml workflow steps locally</name>
  <files>N/A - testing only</files>
  <action>
    Execute all ci.yml workflow steps locally in order:
    1. `pnpm install` - Install dependencies
    2. `pnpm build` - Build all packages
    3. `pnpm lint` - Lint files
    4. `pnpm typecheck` - Type checking
    5. `pnpm test` - Run tests
    
    If any step fails:
    - Read error output to identify root cause
    - Fix the underlying issue (code, config, or dependencies)
    - Re-run failed step to verify fix
    - Continue until all steps pass
    
    Document any fixes made in commit messages.
  </action>
  <verify>
    All ci.yml commands complete with exit code 0:
    - `pnpm build` passes
    - `pnpm lint` passes
    - `pnpm typecheck` passes
    - `pnpm test` passes
  </verify>
  <done>
    All ci.yml workflow steps execute successfully locally with no errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Run docs-validation.yml workflow steps locally</name>
  <files>N/A - testing only</files>
  <action>
    Execute all docs-validation.yml workflow steps locally in order:
    
    Structural Validation Job:
    1. `bash scripts/run-all-checks.sh` - ESLint, links, placeholders, file refs
    
    PikaCSS Validation Job:
    2. `pnpm validate:pikacss` - PikaCSS constraint validation
    3. `bash scripts/verify-api-docs.sh` - API documentation verification
    
    If any step fails:
    - Read error output to identify root cause
    - Fix the underlying issue
    - Re-run failed step to verify fix
    - Continue until all steps pass
    
    Note: These steps depend on `pnpm build` from Task 1.
  </action>
  <verify>
    All docs-validation.yml commands complete with exit code 0:
    - `bash scripts/run-all-checks.sh` passes
    - `pnpm validate:pikacss` passes
    - `bash scripts/verify-api-docs.sh` passes
  </verify>
  <done>
    All docs-validation.yml workflow steps execute successfully locally with no errors
  </done>
</task>

<task type="auto">
  <name>Task 3: Commit all fixes and verify clean state</name>
  <files>Various - depending on fixes needed</files>
  <action>
    1. Review all changes made during Tasks 1-2
    2. Stage all fixes: `git add -A`
    3. Create atomic commit with descriptive message following conventional commits:
       `fix(ci): fix all CI workflow failures for local execution`
    4. Run full validation suite one final time to confirm:
       - All ci.yml steps pass
       - All docs-validation.yml steps pass
    5. Verify git status shows clean working directory
  </action>
  <verify>
    - `git status` shows clean working directory
    - `pnpm build && pnpm lint && pnpm typecheck && pnpm test` passes
    - `bash scripts/run-all-checks.sh` passes
    - `pnpm validate:pikacss` passes
    - `bash scripts/verify-api-docs.sh` passes
  </verify>
  <done>
    All fixes committed, both CI workflows validated locally, repository in clean state ready for CI
  </done>
</task>

</tasks>

<verification>
Run complete CI validation suite:
```bash
# CI workflow
pnpm install && pnpm build && pnpm lint && pnpm typecheck && pnpm test

# Docs validation workflow  
bash scripts/run-all-checks.sh && pnpm validate:pikacss && bash scripts/verify-api-docs.sh
```

All commands must complete with exit code 0.
</verification>

<success_criteria>
- All ci.yml workflow steps pass locally
- All docs-validation.yml workflow steps pass locally
- All fixes committed with descriptive messages
- Repository ready for successful CI runs on GitHub Actions
</success_criteria>

<output>
After completion, create `.planning/quick/007-github-workflows-ci-yml-github-workflows/007-SUMMARY.md`
</output>
