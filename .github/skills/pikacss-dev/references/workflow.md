# Typical Development Workflows

Common development scenarios and step-by-step workflows for completing them.

## Table of Contents

- [Adding a New Feature](#adding-a-new-feature)
- [Fixing a Bug](#fixing-a-bug)
- [Refactoring Code](#refactoring-code)
- [Creating a New Plugin](#creating-a-new-plugin)
- [Updating Dependencies](#updating-dependencies)
- [Preparing a Release](#preparing-a-release)
- [Working with Examples](#working-with-examples)
- [Debugging Failures](#debugging-failures)

---

## Adding a New Feature

### Scenario: Adding style processing feature to core

**Timeline:** ~1-2 hours for simple feature, ~4+ hours for complex

**Steps:**

1. **Plan and understand scope:**
```bash
# Read existing code in the area you're modifying
cat packages/core/src/engine.ts

# Look at similar features
grep -r "similar_feature" packages/core/src/

# Check tests to understand patterns
ls packages/core/tests/
```

2. **Create feature branch:**
```bash
# Create new branch
git checkout -b feat/my-feature

# Verify on correct branch
git branch -v
```

3. **Implement the feature:**
```bash
# Edit source file
# Add implementation in packages/core/src/

# Build to catch syntax errors
pnpm --filter @pikacss/core build
```

4. **Write comprehensive tests:**
```bash
# Create test file
cat > packages/core/tests/unit/my-feature.test.ts <<'EOF'
import { describe, it, expect } from 'vitest'
import { myFeature } from '@pikacss/core'

describe('myFeature', () => {
  it('should work correctly', () => {
    const result = myFeature()
    expect(result).toBe(expected)
  })
})
EOF

# Run tests
pnpm --filter @pikacss/core test my-feature.test.ts
```

5. **Verify quality checks:**
```bash
# Type check
pnpm --filter @pikacss/core typecheck

# Lint
pnpm --filter @pikacss/core lint

# Run all tests
pnpm --filter @pikacss/core test
```

6. **Test dependent packages:**
```bash
# Build this package
pnpm --filter @pikacss/core build

# Build packages that depend on it
pnpm --filter '@pikacss/{integration,unplugin-pikacss}' build

# Test them
pnpm test
```

7. **Update documentation if needed:**
```bash
# If API changed, update docs
cat docs/advanced/api-reference.md

# Add usage example if applicable
cat docs/examples/
```

8. **Commit:**
```bash
# Stage changes
git add packages/core/

# Create commit
git commit -m "feat(core): add my feature

Description of what the feature does and why it was added."

# Verify commit
git log -1
```

9. **Push and create PR:**
```bash
git push origin feat/my-feature

# GitHub will show option to create PR
```

---

## Fixing a Bug

### Scenario: Fixing a style generation bug

**Timeline:** ~30 mins - 2 hours

**Steps:**

1. **Reproduce the bug:**
```bash
# Look at issue or understand the problem
# Create a minimal test case

cat > packages/core/tests/unit/bug-fix.test.ts <<'EOF'
import { describe, it, expect } from 'vitest'

describe('bug fix', () => {
  it('should not have the bug', () => {
    // Reproduce the issue
    const result = buggyFunction()
    expect(result).toBe(correctValue)  // This fails
  })
})
EOF

# Run to confirm it fails
pnpm --filter @pikacss/core test bug-fix.test.ts
```

2. **Create bugfix branch:**
```bash
git checkout -b fix/bug-name
```

3. **Locate the bug:**
```bash
# Search for related code
grep -r "buggy_concept" packages/core/src/

# Examine the problematic file
cat packages/core/src/buggy-file.ts
```

4. **Implement fix:**
```bash
# Edit the file
# Make minimal changes to fix the issue

# Build and test
pnpm --filter @pikacss/core build
pnpm --filter @pikacss/core test bug-fix.test.ts
```

5. **Run full test suite:**
```bash
# Make sure fix doesn't break anything else
pnpm --filter @pikacss/core test

# Check types
pnpm --filter @pikacss/core typecheck

# Check linting
pnpm --filter @pikacss/core lint
```

6. **Test in other packages:**
```bash
# Rebuild and test packages that depend on this
pnpm build
pnpm test
```

7. **Commit fix:**
```bash
git commit -m "fix(core): resolve style generation bug

The bug occurred when X happened. Fix handles this case by Y.

Fixes #123"
```

---

## Refactoring Code

### Scenario: Refactoring module structure

**Timeline:** ~2-4 hours

**Steps:**

1. **Understand scope:**
```bash
# See what code will be affected
grep -r "old_name" packages/core/

# Look at all imports
grep -r "from './old-name'" packages/
```

2. **Create refactor branch:**
```bash
git checkout -b refactor/module-restructure
```

3. **Plan refactoring:**
```bash
# Write down steps:
# 1. Create new file structure
# 2. Move code from old to new
# 3. Update all imports
# 4. Run tests
# 5. Remove old files
```

4. **Do refactoring in small steps:**
```bash
# Step 1: Create new file
touch packages/core/src/new-module.ts

# Step 2: Move code from old to new
# Manually copy and organize code

# Step 3: Update imports in dependent files
sed -i '' "s|from './old-module'|from './new-module'|g" packages/core/src/*.ts

# Step 4: Build and test
pnpm --filter @pikacss/core build
pnpm --filter @pikacss/core test

# Step 5: Remove old file
rm packages/core/src/old-module.ts
```

5. **Verify all tests pass:**
```bash
pnpm test
pnpm typecheck
pnpm lint
```

6. **Commit refactoring:**
```bash
git commit -m "refactor(core): reorganize module structure

Move module logic from old-module.ts to new-module.ts for better organization.

No functional changes - this is a refactoring of internal structure."
```

---

## Creating a New Plugin

### Scenario: Creating a new plugin

**Timeline:** ~1-2 hours

**Steps:**

1. **Use scaffolding tool:**
```bash
# Interactive plugin creation
pnpm newplugin my-plugin

# Follow prompts to configure
```

2. **Review generated structure:**
```bash
ls packages/plugin-my-plugin/

# Check package.json
cat packages/plugin-my-plugin/package.json

# Check template
cat packages/plugin-my-plugin/src/index.ts
```

3. **Implement plugin logic:**
```typescript
// Edit packages/plugin-my-plugin/src/index.ts

import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin() {
  return defineEnginePlugin({
    name: 'my-plugin',
    
    async configureEngine(engine) {
      // Plugin setup logic
      engine.registerShortcut('myShortcut', { /* ... */ })
    },
    
    async transformStyleDefinitions(defs) {
      // Transform styles if needed
      return defs
    }
  })
}
```

4. **Write plugin tests:**
```bash
# Create test file
cat packages/plugin-my-plugin/tests/unit/plugin.test.ts

# Run tests
pnpm --filter @pikacss/plugin-my-plugin test
```

5. **Build plugin:**
```bash
pnpm --filter @pikacss/plugin-my-plugin build
```

6. **Create example usage:**
```typescript
// In docs or examples
import { createEngine } from '@pikacss/core'
import { myPlugin } from '@pikacss/plugin-my-plugin'

const engine = createEngine({
  plugins: [myPlugin()]
})
```

7. **Test in real project:**
```bash
# Create example or test project
pnpm --filter example-project add @pikacss/plugin-my-plugin

# Use plugin in that project
# Verify it works correctly
```

8. **Commit plugin:**
```bash
git add packages/plugin-my-plugin/
git commit -m "feat(plugin-my-plugin): implement my plugin

Provides functionality for X by doing Y."
```

---

## Updating Dependencies

### Scenario: Updating a dependency version

**Timeline:** ~30 mins - 1 hour

**Steps:**

1. **Decide which dependency to update:**
```bash
# Check current versions
cat pnpm-lock.yaml | grep 'eslint:'

# Or use npm/pnpm tools
pnpm list eslint
```

2. **Update dependency:**
```bash
# Update in specific package
pnpm --filter @pikacss/core add -D eslint@latest

# Or update at workspace root
pnpm add -D eslint@latest -w
```

3. **Update lock file:**
```bash
# pnpm updates automatically, but verify
pnpm install
```

4. **Test for compatibility:**
```bash
# Build all packages
pnpm build

# Run full test suite
pnpm test

# Check types
pnpm typecheck

# Check linting (new ESLint might have different rules)
pnpm lint
```

5. **Review breaking changes:**
```bash
# If build fails, check upgrade guide
# Look for API changes
# Update code if needed
```

6. **Commit update:**
```bash
git add pnpm-lock.yaml package.json packages/*/package.json
git commit -m "chore: update eslint to latest

Update ESLint and fix new linting issues per upgrade guide."
```

---

## Preparing a Release

### Scenario: Releasing new version

**Timeline:** ~30 mins

**Prerequisites:** All features complete, all tests passing

**Steps:**

1. **Ensure code is clean:**
```bash
# No uncommitted changes
git status

# All tests pass
pnpm test

# All types check
pnpm typecheck

# All lint passes
pnpm lint

# All packages build
pnpm build
```

2. **Verify exports are valid:**
```bash
# Check all packages
pnpm publint

# Should show no errors
```

3. **Build documentation:**
```bash
# Verify docs build successfully
pnpm docs:build

# Check for broken links or errors
```

4. **Review changes:**
```bash
# See what will be released
git log --oneline HEAD~10..HEAD

# Check if changelog needs update
cat CHANGELOG.md
```

5. **Create release:**
```bash
# This will:
# - Build everything
# - Run tests
# - Type check
# - Validate exports
# - Bump version
# - Create git tag

pnpm release
```

6. **Verify release commit:**
```bash
# Check git log
git log -1

# Should show version bump commit
```

7. **Publish to npm:**
```bash
# After release command, publish
pnpm publish:packages

# Or if that script doesn't exist
npm publish --workspace
```

8. **Verify published:**
```bash
# Check npm
npm view @pikacss/core versions

# Latest should be new version
```

---

## Working with Examples

### Scenario: Testing with example projects

**Timeline:** ~1-2 hours

**Steps:**

1. **Find example project:**
```bash
ls examples/

# Vite examples
ls examples/vite-*/

# Nuxt example
ls examples/nuxt/
```

2. **Install dependencies in example:**
```bash
# Go to example
cd examples/vite-react

# Install
pnpm install
```

3. **Test with local version:**
```bash
# Example already uses local packages via workspace

# Start dev server
pnpm dev

# Or build
pnpm build
```

4. **Make code changes and test:**
```bash
# Edit source in packages/
cd ../../packages/core/src/

# Make change
# Save file

# Example dev server auto-rebuilds
# Check browser for changes
```

5. **Verify example works:**
```bash
# Build example
pnpm build

# Run example tests if exists
pnpm test
```

6. **Create new example if needed:**
```bash
# Create directory
mkdir examples/my-framework-react

# Copy package.json from similar example
cp examples/vite-react/package.json examples/my-framework-react/

# Modify as needed
# Install dependencies
cd examples/my-framework-react
pnpm install

# Create source files
mkdir src
cat > src/main.tsx <<'EOF'
// Example code
EOF
```

---

## Debugging Failures

### Scenario: Build fails unexpectedly

**Timeline:** ~30 mins - 1 hour

**Steps:**

1. **Capture error output:**
```bash
# Save full error
pnpm build > build-error.txt 2>&1

# Review error file
cat build-error.txt
```

2. **Isolate the problem:**
```bash
# Try building single package
pnpm --filter @pikacss/core build

# See if that works or also fails
```

3. **Check for common issues:**
```bash
# Clear cache
rimraf packages/*/dist

# Try again
pnpm build
```

4. **Check recent changes:**
```bash
# See what changed
git diff HEAD~1

# Or check git log
git log -1
```

5. **Revert if needed:**
```bash
# If recent change broke it
git revert HEAD

# Or try previous commit
git checkout HEAD~1

# See if builds
pnpm build
```

6. **Debug specific issue:**
```bash
# Enable verbose output
DEBUG=* pnpm build

# Run with full error reporting
pnpm build -- --verbose
```

7. **Ask for help if stuck:**
```bash
# Include in issue:
# - Full error message
# - Environment (Node version, OS)
# - Recent changes
# - Steps to reproduce
```

---

### Scenario: Tests fail unexpectedly

**Steps:**

1. **Run failing test:**
```bash
# Run the test file
pnpm --filter @pikacss/core test failing.test.ts

# With verbose output
pnpm --filter @pikacss/core test failing.test.ts -- --reporter=verbose
```

2. **Check for common causes:**
```bash
# Rebuild
pnpm build
pnpm --filter @pikacss/core test failing.test.ts

# Clean and rebuild
rimraf packages/*/dist
pnpm build
pnpm test
```

3. **Review test code:**
```bash
# Look at what the test does
cat packages/core/tests/unit/failing.test.ts

# Check for timing issues, async issues, etc.
```

4. **Check for environment issues:**
```bash
# Run full suite
pnpm test

# If only fails sometimes, might be flaky
# Run multiple times
for i in {1..5}; do pnpm test; done
```

---

## Common Patterns

### Pattern: "Build → Test → Commit" Loop

Most development follows this pattern:

```bash
# 1. Make code change
# Edit files...

# 2. Build
pnpm build

# 3. Test
pnpm test

# 4. Check types and lint
pnpm typecheck && pnpm lint

# 5. If all pass, commit
git add .
git commit -m "feat: description"

# 6. If failed, fix and go back to step 2
```

### Pattern: Watch Mode Development

For rapid development:

```bash
# Terminal 1: Build in watch mode
pnpm --filter @pikacss/core build:watch

# Terminal 2: Test in watch mode
pnpm --filter @pikacss/core test:watch

# Terminal 3: Dev server (for examples)
cd examples/vite-react
pnpm dev

# Make changes - everything updates automatically
```

### Pattern: Testing Single Package

When working on specific package:

```bash
# Focus on one package
cd packages/core

# Run its tests
pnpm test

# Build it
pnpm build

# When done, verify not broken anything
cd ../..
pnpm build
pnpm test
```

---

## Reference

- [Development Commands](./commands.md) - All pnpm commands
- [Package Structure](./packages.md) - Package organization
- [Debugging Guide](./debugging.md) - Troubleshooting help
