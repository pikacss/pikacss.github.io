---
phase: quick-014
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - packages/api-verifier/tests/developer-docs/agents.test.ts
  - packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
  - packages/api-verifier/tests/docs/plugin-development.test.ts
  - packages/api-verifier/tests/plugins/plugin-icons.test.ts
  - packages/api-verifier/tests/plugins/plugin-reset.test.ts
  - packages/api-verifier/tests/plugins/plugin-typography.test.ts
  - .gitattributes
autonomous: true

must_haves:
  truths:
    - All api-verifier tests pass on Windows GitHub Runner
    - Regex patterns match content regardless of line ending style (LF vs CRLF)
    - Git enforces LF line endings for markdown files in the repository
  artifacts:
    - path: "packages/api-verifier/tests/**/*.test.ts"
      provides: "Cross-platform compatible regex patterns"
      contains: "readFileSync.*'utf-8'"
    - path: ".gitattributes"
      provides: "Git line ending normalization rules"
      contains: "*.md text eol=lf"
  key_links:
    - from: "test files"
      to: "markdown content"
      via: "regex patterns with \\r?\\n for line breaks"
      pattern: "match\\(/.*\\\\r\\?\\\\n"
---

<objective>
Fix Windows GitHub Runner test failures in @pikacss/api-verifier by making regex patterns cross-platform compatible.

**Purpose:** Ensure CI tests pass on all platforms (Windows, Linux, macOS) by handling different line ending conventions.

**Output:** 
- Updated test files with CRLF-tolerant regex patterns
- .gitattributes file to normalize line endings
- All 7 failing tests passing on Windows
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

## Problem Analysis

All 7 test failures in Windows GitHub Runner are caused by regex patterns returning `null` when trying to match markdown content:

1. **agents.test.ts** (2 failures):
   - Line 28: `tableMatch` is null when matching Package Dependencies table
   - Line 147: Same pattern causes NPE when accessing match groups

2. **pikacss-expert-skill.test.ts** (1 failure):
   - Line 189: No TypeScript code blocks matched (codeBlocks.length === 0)

3. **plugin-development.test.ts** (1 failure):
   - Line 107: `codeBlocks` is null when extracting TypeScript examples

4. **plugin-icons.test.ts** (1 failure):
   - Line 116: `codeBlocks` is null when matching code examples

5. **plugin-reset.test.ts** (1 failure):
   - Line 49: `codeBlocks` is null when matching code examples

6. **plugin-typography.test.ts** (1 failure):
   - Similar pattern to other plugin tests

**Root Cause:** Regex patterns use `\n` for line breaks, but Windows files may have `\r\n` (CRLF). Patterns like `/```typescript\n([\s\S]*?)\n```/g` fail to match when actual content has `\r\n`.

**Solution Strategy:**
1. Add `.gitattributes` to normalize line endings to LF in repository
2. Update regex patterns to handle both LF and CRLF (use `\r?\n` instead of `\n`)
3. Ensure `[\s\S]` still captures content correctly across line ending styles
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create .gitattributes to normalize line endings</name>
  <files>.gitattributes</files>
  <action>
Create `.gitattributes` file at repository root to enforce LF line endings for text files:

```
# Normalize line endings to LF for all text files
* text=auto eol=lf

# Explicitly declare markdown files as text with LF
*.md text eol=lf

# Explicitly declare source files as text with LF
*.ts text eol=lf
*.js text eol=lf
*.vue text eol=lf
*.json text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Declare binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
```

This ensures:
- All developers get LF endings in working directory
- Repository always stores LF endings
- Windows Git converts LF to CRLF in working tree (text=auto)
- Markdown files specifically use LF (prevents Windows CRLF issues)
  </action>
  <verify>
Check file exists and has correct content:
```bash
cat .gitattributes | grep "*.md text eol=lf"
```
  </verify>
  <done>
.gitattributes file exists at repository root with proper line ending rules for markdown and source files.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update regex patterns to handle CRLF line endings</name>
  <files>
packages/api-verifier/tests/developer-docs/agents.test.ts
packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
packages/api-verifier/tests/docs/plugin-development.test.ts
packages/api-verifier/tests/plugins/plugin-icons.test.ts
packages/api-verifier/tests/plugins/plugin-reset.test.ts
packages/api-verifier/tests/plugins/plugin-typography.test.ts
  </files>
  <action>
Update all regex patterns in test files to handle both LF (`\n`) and CRLF (`\r\n`) line endings.

**Pattern changes:**
- `\n` → `\r?\n` (matches optional carriage return before newline)
- `/```typescript\n/` → `/```typescript\r?\n/`
- `/\n```/` → `/\r?\n```/`
- `/[\s\S]*?\n\n/` → `/[\s\S]*?(\r?\n){2}/`

**Files to update:**

1. **agents.test.ts** (line 28, 46, 152):
   - Line 28: `match(/\| Package \| Role \| Dependencies \|[\s\S]*?\n\n/)` → `match(/\| Package \| Role \| Dependencies \|[\s\S]*?(\r?\n){2}/)`
   - Line 46: `match(/```[\s\S]*?Framework Layer[\s\S]*?```/)` - Already good (no explicit \n)
   - Line 152: Same as line 28

2. **pikacss-expert-skill.test.ts** (line 189):
   - Line 189: `matchAll(/```(?:typescript|ts)\n([\s\S]*?)```/g)` → `matchAll(/```(?:typescript|ts)\r?\n([\s\S]*?)```/g)`
   - Line 91: `match(/### Pseudo-Elements[\s\S]*?```typescript([\s\S]*?)```/)` → already captures correctly
   - All other similar patterns

3. **plugin-development.test.ts** (line 107):
   - Line 107: `match(/```typescript\n([\s\S]*?)\n```/g)` → `match(/```typescript\r?\n([\s\S]*?)\r?\n```/g)`

4. **plugin-icons.test.ts** (line 116):
   - Line 116: `match(/```typescript\n([\s\S]*?)\n```/g)` → `match(/```typescript\r?\n([\s\S]*?)\r?\n```/g)`

5. **plugin-reset.test.ts** (line 49):
   - Line 49: `match(/```typescript\n([\s\S]*?)\n```/g)` → `match(/```typescript\r?\n([\s\S]*?)\r?\n```/g)`

6. **plugin-typography.test.ts**:
   - Apply same pattern as other plugin tests

**Implementation approach:**
- Use Edit tool to replace each occurrence
- Search for `/```typescript\n` and replace with `/```typescript\r?\n`
- Search for `/\n```/` and replace with `/\r?\n```/`
- Search for `/[\s\S]*?\n\n/` and replace with `/[\s\S]*?(\r?\n){2}/`
- Ensure capture groups remain intact
  </action>
  <verify>
Run tests to ensure patterns now match on both platforms:
```bash
pnpm --filter @pikacss/api-verifier test
```

All 7 previously failing tests should now pass:
- agents.test.ts: "lists all monorepo packages" ✓
- agents.test.ts: "package count matches between sections" ✓
- pikacss-expert-skill.test.ts: "code examples are syntactically valid TypeScript" ✓
- plugin-development.test.ts: "should have correct code syntax in all examples" ✓
- plugin-icons.test.ts: "should have correct function call syntax" ✓
- plugin-reset.test.ts: "should have working code examples" ✓
- plugin-typography.test.ts: "should have correct function call syntax in examples" ✓
  </verify>
  <done>
All regex patterns in api-verifier tests handle both LF and CRLF line endings. Tests pass on Windows GitHub Runner.
  </done>
</task>

<task type="auto">
  <name>Task 3: Verify cross-platform compatibility</name>
  <files>N/A (verification only)</files>
  <action>
Run full test suite to ensure:
1. All api-verifier tests pass locally (macOS/Linux with LF)
2. No regressions introduced in other test files
3. TypeScript compilation succeeds
4. Linting passes

Then verify the changes will work on Windows:
1. Check that .gitattributes rules are correct
2. Verify regex patterns handle both `\n` and `\r\n`
3. Confirm no hardcoded line ending assumptions remain
  </action>
  <verify>
```bash
# Run all tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

All commands should succeed with no errors.
  </verify>
  <done>
Complete test suite passes. Cross-platform regex patterns work correctly on all platforms. .gitattributes ensures consistent line endings in repository.
  </done>
</task>

</tasks>

<verification>
**Success Criteria:**

1. ✅ `.gitattributes` file exists with proper rules
2. ✅ All test files updated with CRLF-tolerant regex patterns  
3. ✅ `pnpm --filter @pikacss/api-verifier test` passes locally
4. ✅ No TypeScript or linting errors
5. ✅ Windows GitHub Runner CI tests pass (will verify in CI)

**Manual verification steps:**
```bash
# Check .gitattributes created
cat .gitattributes | grep "*.md text eol=lf"

# Verify regex patterns updated (should find \r?\n patterns)
grep -r "typescript\\\\r" packages/api-verifier/tests/

# Run tests
pnpm --filter @pikacss/api-verifier test
```
</verification>

<success_criteria>
1. All 7 failing Windows tests now pass
2. .gitattributes enforces LF line endings for text files
3. Regex patterns use `\r?\n` instead of hardcoded `\n`
4. No test regressions on macOS/Linux
5. CI pipeline green on all platforms
</success_criteria>

<output>
After completion, create `.planning/quick/014-fix-windows-github-runner-test-failures-/014-SUMMARY.md`

Document:
- Number of test files updated (6)
- Number of regex patterns fixed (~15)
- .gitattributes rules added
- Verification that tests pass on all platforms
</output>
