---
phase: quick-001
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - skills/
  - AGENTS.md
  - packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts
  - packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
  - .planning/**/*.md
autonomous: true

must_haves:
  truths:
    - "Skills directory exists at ./skills instead of ./skills"
    - "All skill files are accessible at new location"
    - "Test suite passes with updated paths"
    - "Documentation references point to new location"
  artifacts:
    - path: "skills/pikacss-dev/SKILL.md"
      provides: "Developer workflow skill"
    - path: "skills/pikacss-expert/SKILL.md"
      provides: "User API guidance skill"
    - path: "skills/README.md"
      provides: "Skills system documentation"
  key_links:
    - from: "packages/api-verifier/tests/"
      to: "skills/"
      via: "file path imports"
      pattern: "join\\(.*'skills'"
    - from: "AGENTS.md"
      to: "skills/"
      via: "documentation links"
      pattern: "\\[.*\\]\\(.*skills/"
---

<objective>
Move `skills/` directory to `./skills` to improve discoverability and align with project structure conventions.

Purpose: Skills documentation is not GitHub-specific infrastructure and should live at project root level alongside other developer documentation.

Output: 
- `./skills/` directory with all skill content
- Updated test file paths (2 files)
- Updated documentation references (76+ occurrences)
- Verified test suite passes
</objective>

<execution_context>
@/Users/deviltea/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/deviltea/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@AGENTS.md
@skills/README.md
@skills/SKILLS-ARCHITECTURE.md
@packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts
@packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
</context>

<tasks>

<task type="auto">
  <name>Move skills directory and update test imports</name>
  <files>
    skills/
    packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts
    packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts
  </files>
  <action>
Move the entire `skills/` directory to `./skills`:

```bash
git mv skills ./skills
```

Update test file imports to use new path:

**File 1:** `packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts`
- Change: `join(monorepoRoot, 'skills/pikacss-dev/SKILL.md')` → `join(monorepoRoot, 'skills/pikacss-dev/SKILL.md')`
- Change: `join(monorepoRoot, 'skills/pikacss-dev', ref)` → `join(monorepoRoot, 'skills/pikacss-dev', ref)`

**File 2:** `packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts`
- Change: `join(monorepoRoot, 'skills/pikacss-expert/SKILL.md')` → `join(monorepoRoot, 'skills/pikacss-expert/SKILL.md')`

Run tests to verify paths work:
```bash
pnpm --filter @pikacss/api-verifier test pikacss-dev-skill
pnpm --filter @pikacss/api-verifier test pikacss-expert-skill
```
  </action>
  <verify>
```bash
# Verify directory exists
ls -la skills/

# Verify old directory removed
! test -d skills

# Verify tests pass
pnpm --filter @pikacss/api-verifier test pikacss-dev-skill
pnpm --filter @pikacss/api-verifier test pikacss-expert-skill
```
  </verify>
  <done>
- `./skills/` directory exists with all content from `skills/`
- `skills/` directory no longer exists
- Both skill test files pass successfully
- Test imports reference `skills/` path
  </done>
</task>

<task type="auto">
  <name>Update documentation references</name>
  <files>
    AGENTS.md
    .planning/**/*.md
  </files>
  <action>
Update all markdown documentation references from `skills` to `skills`:

**AGENTS.md** (lines 29-30, 646-648):
- Replace: `skills/pikacss-dev/SKILL.md` → `skills/pikacss-dev/SKILL.md`
- Replace: `skills/pikacss-expert/SKILL.md` → `skills/pikacss-expert/SKILL.md`
- Replace: `skills/pikacss-docs/SKILL.md` → `skills/pikacss-docs/SKILL.md`

**Planning directory files** (~76 occurrences):
Use global find and replace for all `.planning/**/*.md` files:

```bash
# Find all occurrences first
grep -r "\skills" .planning/ --include="*.md" | wc -l

# Replace all occurrences
find .planning -name "*.md" -type f -exec sed -i '' 's|\skills|skills|g' {} +

# Verify replacement
grep -r "\skills" .planning/ --include="*.md" || echo "All references updated"
```

Note: Keep planning history accurate - these are archival references to paths that existed at the time.
  </action>
  <verify>
```bash
# Check AGENTS.md updated
grep "skills/pikacss-dev/SKILL.md" AGENTS.md
grep "skills/pikacss-expert/SKILL.md" AGENTS.md

# Check no old references remain in AGENTS.md
! grep "\skills" AGENTS.md

# Count updated references in planning
grep -r "skills/pikacss-dev\|skills/pikacss-expert" .planning/ --include="*.md" | wc -l

# Verify old pattern mostly gone (some may remain in historical quotes)
grep -r "\skills" .planning/ --include="*.md" | wc -l
```
  </verify>
  <done>
- AGENTS.md references updated to `skills/` paths
- Planning documentation references updated
- No broken links in documentation
- References are semantically correct (planning history preserved)
  </done>
</task>

<task type="auto">
  <name>Verify and commit changes</name>
  <files>N/A</files>
  <action>
Run full verification to ensure nothing broken:

```bash
# Run all tests
pnpm test

# Type check
pnpm typecheck

# Lint check
pnpm lint

# Verify documentation builds
pnpm docs:build
```

Commit changes with descriptive message:

```bash
git add -A
git commit -m "refactor: move skills to ./skills

Move skills documentation from skills to ./skills for better
discoverability and alignment with project structure.

Changes:
- Move skills/ → ./skills/
- Update test imports (api-verifier)
- Update AGENTS.md references
- Update planning documentation references

All tests passing, no functionality changed."
```
  </action>
  <verify>
```bash
# Verify commit created
git log -1 --oneline | grep "move.*skills"

# Verify no uncommitted changes
git status --porcelain | grep -v "^??" || echo "All changes committed"

# Verify skills directory in git
git ls-files | grep "^skills/"

# Verify old path not in git
! git ls-files | grep "^\skills/"
```
  </verify>
  <done>
- All tests pass (pnpm test)
- Type checking passes (pnpm typecheck)
- Linting passes (pnpm lint)
- Documentation builds successfully
- Changes committed to git
- Old `skills/` path removed from git
- New `skills/` path tracked in git
  </done>
</task>

</tasks>

<verification>
## Overall Verification

```bash
# 1. Directory structure correct
ls -la skills/ | grep -E "pikacss-dev|pikacss-expert|README.md|SKILLS-ARCHITECTURE.md"

# 2. Tests pass
pnpm --filter @pikacss/api-verifier test

# 3. Documentation references correct
grep -r "skills/pikacss" AGENTS.md

# 4. No broken references
! grep "\skills" AGENTS.md

# 5. Git history clean
git log -1 --stat | grep skills

# 6. Full build succeeds
pnpm build && pnpm docs:build
```
</verification>

<success_criteria>
- ✅ `./skills/` directory exists with all original content
- ✅ `skills/` directory no longer exists
- ✅ All test files pass with updated paths
- ✅ AGENTS.md references point to `skills/`
- ✅ Planning documentation updated (historical accuracy preserved)
- ✅ Git history shows clean move operation
- ✅ Full test suite passes
- ✅ Documentation builds successfully
- ✅ No broken references or imports
</success_criteria>

<output>
After completion, create `.planning/quick/001-move-github-skills-to-skills/001-SUMMARY.md` following the summary template.
</output>
