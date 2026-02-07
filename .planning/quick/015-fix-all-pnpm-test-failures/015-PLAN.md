---
phase: quick
plan: 015
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/api-verifier/src/comparator.ts
autonomous: true
must_haves:
  truths:
    - "All unit tests pass"
    - "API comparator correctly handles simplified signatures in GUIDE context"
  artifacts:
    - path: packages/api-verifier/src/comparator.ts
      provides: "Fixed comparison logic"
---

<objective>
Fix the failing unit tests in @pikacss/api-verifier by updating the signature comparison logic for GUIDE context.
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@packages/api-verifier/src/comparator.ts
@packages/api-verifier/tests/unit/comparator.test.ts
</context>

<tasks>

<task type="auto">
  <name>Fix API comparator signature matching</name>
  <files>packages/api-verifier/src/comparator.ts</files>
  <action>
    Update `compareSignatures` function to extract function names from raw signature strings instead of normalized ones when running in `DocumentationType.GUIDE` context.
    
    The current implementation relies on `normalizeSignature` output, which strips function names from declarations (converting them to arrow syntax), causing name mismatch checks to fail against simplified documentation (e.g., `function foo()` vs `foo()`).
    
    Implementation details:
    - In `if (context === DocumentationType.GUIDE)` block:
    - Clean `extracted` and `documented` strings by removing `export`, `async`, `function` prefixes.
    - Extract the first word as the name from both cleaned strings.
    - Compare these names.
  </action>
  <verify>pnpm --filter @pikacss/api-verifier test tests/unit/comparator.test.ts</verify>
  <done>All tests in comparator.test.ts pass</done>
</task>

<task type="auto">
  <name>Verify all tests</name>
  <files>packages/api-verifier/src/comparator.ts</files>
  <action>Run the full test suite to ensure no regressions and verify the overall fix.</action>
  <verify>pnpm test</verify>
  <done>All tests pass with exit code 0</done>
</task>

</tasks>

<success_criteria>
- `pnpm test` passes successfully (exit code 0)
- `tests/unit/comparator.test.ts` passes (2 previously failing tests fixed)
</success_criteria>
