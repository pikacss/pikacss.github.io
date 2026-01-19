# Development Debugging Guide

Complete troubleshooting guide for common development issues and how to resolve them.

## Table of Contents

- [Build Issues](#build-issues)
- [Test Issues](#test-issues)
- [Type Errors](#type-errors)
- [Linting Issues](#linting-issues)
- [Runtime Issues](#runtime-issues)
- [Package Issues](#package-issues)
- [Dependency Issues](#dependency-issues)
- [Debugging Techniques](#debugging-techniques)
- [Getting Help](#getting-help)

---

## Build Issues

### Build Fails with "Cannot find module" Error

**Symptoms:**
```
Error: Cannot find module '@pikacss/core'
```

**Causes:**
- Circular dependency between packages
- Package not built before dependent package
- Missing export in package.json

**Solutions:**

1. **Check build order:**
```bash
# Build packages in correct dependency order
pnpm build

# Or build specific package manually
pnpm --filter @pikacss/core build
pnpm --filter @pikacss/integration build
pnpm --filter @pikacss/unplugin-pikacss build
```

2. **Clear build cache:**
```bash
# Remove all dist directories
rimraf packages/*/dist

# Rebuild from scratch
pnpm build
```

3. **Check package.json exports:**
```bash
# Verify exports are valid
pnpm publint --filter @pikacss/core

# Check specific package
pnpm --filter @pikacss/core exec publint
```

4. **Verify imports:**
```bash
# Check all imports in the failing package
grep -r "from '@pikacss" packages/failing-package/src/

# Verify referenced packages are built
ls packages/core/dist/
```

---

### Build Fails with TypeScript Error

**Symptoms:**
```
error TS1234: Cannot find type definition
```

**Causes:**
- Missing TypeScript configuration
- Incorrect tsconfig references
- Type definition not exported in package.json

**Solutions:**

1. **Check tsconfig.json:**
```bash
# Verify tsconfig structure
cat packages/core/tsconfig.package.json

# Should include 'src/**/*'
```

2. **Run type check:**
```bash
pnpm typecheck

# Check specific package
pnpm --filter @pikacss/core typecheck
```

3. **Verify type exports:**
```bash
# Check package.json includes types field
cat packages/core/package.json | grep -A5 '"types"'

# Should have: "types": "./dist/index.d.ts"
```

---

### Build Produces Empty dist/ Directory

**Symptoms:**
```bash
ls packages/core/dist/
# Nothing or only old files
```

**Causes:**
- Build cache corruption
- Source files not found
- tsdown configuration issue
- Permission issues

**Solutions:**

1. **Clean and rebuild:**
```bash
# Remove dist completely
rm -rf packages/core/dist

# Rebuild
pnpm --filter @pikacss/core build
```

2. **Check source files exist:**
```bash
# Verify src/ directory
ls -la packages/core/src/

# Should have index.ts
cat packages/core/src/index.ts
```

3. **Run with verbose output:**
```bash
# Enable debug logging
DEBUG=* pnpm --filter @pikacss/core build
```

---

### Build Hangs or Takes Too Long

**Symptoms:**
- Build seems stuck, no progress for minutes
- CPU usage low but build not completing

**Causes:**
- Circular dependency detection taking time
- Large dependency chain
- Disk I/O slow

**Solutions:**

1. **Cancel and try focused build:**
```bash
# Cancel current build (Ctrl+C)

# Build single package only
pnpm --filter @pikacss/core build
```

2. **Check for circular dependencies:**
```bash
# Run linter which detects circulars
pnpm lint

# Look for circular dependency warnings
```

3. **Try incremental build:**
```bash
# Build only changed packages
pnpm build

# pnpm automatically detects what changed
```

---

## Test Issues

### Tests Fail with "Cannot find module" Error

**Symptoms:**
```
Error: Cannot find module '@pikacss/core'
```

**Causes:**
- Package not built before tests run
- Test path configuration incorrect
- Module resolution issue

**Solutions:**

1. **Build package first:**
```bash
# Build the package
pnpm --filter @pikacss/core build

# Then run tests
pnpm --filter @pikacss/core test
```

2. **Run full build:**
```bash
# Build all packages
pnpm build

# Then run all tests
pnpm test
```

3. **Check vitest config:**
```bash
# Look for vitest.config.ts
cat packages/core/vitest.config.ts

# Should have correct module resolution
```

---

### Tests Fail Sporadically (Flaky Tests)

**Symptoms:**
- Test passes sometimes, fails sometimes
- Different results on different machines
- Failures appear random

**Causes:**
- Test timing dependencies
- Shared mutable state
- Async tests not properly awaited
- Race conditions

**Solutions:**

1. **Run tests multiple times:**
```bash
# Run test multiple times to reproduce
for i in {1..10}; do
  pnpm --filter @pikacss/core test specific.test.ts
done
```

2. **Check test isolation:**
```bash
# Review test setup and teardown
cat packages/core/tests/unit/test.ts

# Look for beforeEach/afterEach
# Verify no shared global state
```

3. **Use verbose output:**
```bash
# Run with detailed output
pnpm --filter @pikacss/core test -- --reporter=verbose
```

4. **Run single test file:**
```bash
# Test individual file in isolation
pnpm --filter @pikacss/core test specific.test.ts
```

---

### Tests Fail in CI but Pass Locally

**Symptoms:**
- Local: `pnpm test` passes
- CI: Same tests fail
- Can't reproduce locally

**Causes:**
- Environment differences
- Missing environment variables
- Different Node version
- Timing-dependent tests
- File system differences

**Solutions:**

1. **Check Node version:**
```bash
# Show current Node version
node --version

# CI uses specific version (check CI config)
# Update Node if different
```

2. **Check environment variables:**
```bash
# Look for env var usage
grep -r "process.env" packages/*/tests/

# Set same variables locally
export DEBUG=pikacss
pnpm test
```

3. **Run full test suite:**
```bash
# Run everything like CI does
pnpm build
pnpm test
```

4. **Check CI logs:**
- Review actual CI failure message
- Look for specific test name
- Check if output differs

---

### Specific Test File Fails

**Symptoms:**
```bash
✓ test-a.ts (5 tests)
✗ test-b.ts (1 test failed)
```

**Debugging Steps:**

1. **Run the specific test:**
```bash
# Test only the failing file
pnpm --filter @pikacss/core test test-b.ts
```

2. **See full error:**
```bash
# Run with verbose output
pnpm --filter @pikacss/core test test-b.ts -- --reporter=verbose
```

3. **Check test code:**
```bash
# Review the test
cat packages/core/tests/unit/test-b.ts

# Look for async/await issues
# Check assertions
```

4. **Add debug logging:**
```typescript
// In the test file
it('should do something', async () => {
  console.log('Starting test')
  const result = await functionUnderTest()
  console.log('Result:', result)
  expect(result).toBe(expected)
})
```

5. **Run with debugging:**
```bash
# Enable debug output
DEBUG=pikacss pnpm --filter @pikacss/core test test-b.ts
```

---

## Type Errors

### TypeScript Reports "Cannot find name" Error

**Symptoms:**
```
error TS2304: Cannot find name 'MyInterface'
```

**Causes:**
- Type not imported
- Type not exported from module
- Wrong import path
- Circular type reference

**Solutions:**

1. **Check imports:**
```typescript
// Verify import statement exists
import type { MyInterface } from '@pikacss/core'

// Look for typos in import path
```

2. **Check exports:**
```bash
# Look at package.json exports
cat packages/core/package.json | grep -A10 exports

# Verify type definition exported
```

3. **Run full typecheck:**
```bash
pnpm typecheck

# Get full list of type errors
pnpm --filter @pikacss/core typecheck
```

---

### TypeScript Reports "Duplicate identifier" Error

**Symptoms:**
```
error TS2300: Duplicate identifier 'MyType'
```

**Causes:**
- Type declared multiple times
- Conflicting imports
- Circular type imports

**Solutions:**

1. **Find duplicates:**
```bash
# Search for type declaration
grep -r "type MyType" packages/

# Find all occurrences
```

2. **Check for circular imports:**
```bash
# Look at file1.ts imports
cat packages/core/src/file1.ts | grep "^import"

# Look at imported file
cat packages/core/src/file2.ts | grep "^import"

# Check if file2 imports file1 back
```

3. **Use distinct namespaces:**
```typescript
// If types conflict, namespace them
export namespace CoreTypes {
  export interface MyInterface { }
}

export namespace IntegrationTypes {
  export interface MyInterface { }
}
```

---

### "Cannot find module" for Type Declaration

**Symptoms:**
```
error TS2307: Cannot find module '@pikacss/core/types'
```

**Causes:**
- Type declaration file not exported
- Wrong path in package.json
- Type file not built

**Solutions:**

1. **Check package.json exports:**
```bash
# Verify type exports map
cat packages/core/package.json | jq '.exports'

# Should include types for all entry points
```

2. **Build packages:**
```bash
# Ensure types are generated
pnpm build
pnpm typecheck
```

---

## Linting Issues

### ESLint Reports Formatting Issues

**Symptoms:**
```
error: Missing space before function paren (space-before-function-paren)
```

**Solutions:**

1. **Auto-fix:**
```bash
# ESLint with --fix flag auto-corrects many issues
pnpm lint

# Fix specific package
pnpm --filter @pikacss/core lint
```

2. **View all issues:**
```bash
# Show issues without fixing
pnpm lint -- --no-fix

# Or run ESLint directly
pnpm exec eslint packages/core/src/
```

3. **Manual fix if needed:**
```bash
# Look at specific file
cat packages/core/src/index.ts

# Fix manually, then re-run
pnpm lint
```

---

### ESLint Reports Unused Variable

**Symptoms:**
```
error: 'unused' is defined but never used (no-unused-vars)
```

**Solutions:**

1. **Remove unused variable:**
```typescript
// Before
const unused = getValue()
const result = doSomething()

// After
const result = doSomething()
```

2. **Or prefix with underscore if intentional:**
```typescript
const _unused = getValue()  // Intentionally unused
```

---

## Runtime Issues

### Generated Code Not Working

**Symptoms:**
- CSS generated but not applied
- Class names not found
- `pika.gen.ts` has wrong types

**Causes:**
- Integration not scanning all code
- Build-time evaluation failed
- Runtime variable passed to pika()
- Code not in watched paths

**Solutions:**

1. **Verify integration is scanning:**
```bash
# Check for pika.gen.css and pika.gen.ts
ls pika.gen.*

# Should exist in project root or build output
```

2. **Check build-time evaluation:**
```bash
# Ensure all pika() calls use static values
grep -r "pika(" src/

# All arguments should be literal values
```

3. **Review generated files:**
```bash
# Check generated CSS
cat pika.gen.css | head -50

# Check generated types
cat pika.gen.ts | head -50
```

4. **Rebuild:**
```bash
# Force regeneration
pnpm build
```

---

### Hot Module Replacement (HMR) Not Working

**Symptoms:**
- Code changes require full page reload
- `pika.gen.css` changes don't reflect
- DevTools show stale CSS

**Causes:**
- HMR not configured
- Virtual module not set up
- Bundler caching issue

**Solutions:**

1. **Verify Vite HMR is enabled:**
```bash
# Check vite.config.ts
cat vite.config.ts

# Should have no explicit HMR disable
```

2. **Check generated file watching:**
```bash
# Look for pika.gen.css in dist
ls dist/

# Should regenerate on changes
```

3. **Clear bundler cache:**
```bash
# For Vite
rm -rf .vite

# Restart dev server
pnpm dev
```

---

## Package Issues

### Circular Dependency Error

**Symptoms:**
```
error: Circular dependency detected
  @pikacss/unplugin → @pikacss/integration → @pikacss/unplugin
```

**Causes:**
- Package A imports from package B
- Package B imports from package A
- Creating cycle

**Solutions:**

1. **Visualize dependencies:**
```bash
# Show dependency tree
pnpm list

# Show specific package deps
pnpm list @pikacss/core
```

2. **Find circular imports:**
```bash
# Search for problematic imports
grep -r "from '@pikacss/unplugin'" packages/integration/src/

# Remove this import to break cycle
```

3. **Refactor to remove cycle:**
- Move shared code to separate package
- Use dependency injection
- Reverse import direction if possible

---

### Missing Peer Dependency

**Symptoms:**
```
error: peer dep '@pikacss/core@^0.0.39' not installed
```

**Causes:**
- Package.json missing peerDependencies
- Dependency not installed

**Solutions:**

1. **Add peer dependency:**
```json
{
  "peerDependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

2. **Install dependencies:**
```bash
pnpm install
```

---

## Dependency Issues

### npm Package Version Mismatch

**Symptoms:**
- Tests fail with different Node version
- Build fails on CI but works locally

**Causes:**
- Different npm/pnpm versions
- Node version mismatch
- Lock file differences

**Solutions:**

1. **Check versions:**
```bash
node --version
npm --version
pnpm --version
```

2. **Use .nvmrc for Node version:**
```bash
# Create .nvmrc in project root
echo "18.17.0" > .nvmrc

# Use with nvm
nvm use
```

3. **Regenerate lock file:**
```bash
# Remove lock files
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

---

### Dependency Not Found at Runtime

**Symptoms:**
```
Error: Cannot find module 'dependency'
```

**Causes:**
- Dependency not in package.json
- Dependency not installed

**Solutions:**

1. **Install missing dependency:**
```bash
# Install in specific package
pnpm --filter @pikacss/core add missing-package

# Or add as peer dependency
pnpm --filter @pikacss/core add -D missing-package
```

2. **Check package.json:**
```bash
# Verify dependency is listed
cat package.json | grep missing-package
```

---

## Debugging Techniques

### Enable Debug Logging

**Global debug:**
```bash
DEBUG=* pnpm build
DEBUG=* pnpm test
```

**For specific component:**
```bash
DEBUG=pikacss:* pnpm build
DEBUG=pikacss:integration:* pnpm build
```

**In code:**
```typescript
const debug = require('debug')('pikacss:core')
debug('Message:', variable)
```

---

### Use Node Inspector

**Inspect tests:**
```bash
# Run tests with inspector
node --inspect-brk node_modules/vitest/vitest.mjs run

# Opens DevTools: chrome://inspect
```

**Inspect build:**
```bash
# Add debugger statements in build code
// debugger;

# Run with inspector
node --inspect-brk node_modules/tsdown/bin/tsdown.js
```

---

### Git Bisect for Regression

**Find when bug was introduced:**
```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark known good commit
git bisect good v0.0.30

# Git will checkout commits between
# Run test/build to determine if good or bad
git bisect good  # or git bisect bad

# Git narrows down to specific commit
git bisect reset  # Exit bisect
```

---

### Compare with Working Version

```bash
# Create test branch
git checkout -b debug-issue

# Try previous version
git checkout HEAD~5

# Test if works
pnpm build && pnpm test

# If works, something between current and here broke it
git log HEAD..main  # Show commits since last good version
```

---

## Getting Help

### When Stuck

1. **Reproduce the issue:**
   - Create minimal test case
   - Document exact steps
   - Note all error messages

2. **Check existing issues:**
   ```bash
   # Search project issues
   # Look for similar error messages
   ```

3. **Review documentation:**
   - Check `docs/` for related info
   - Review package README
   - Look at other packages for patterns

4. **Ask for help:**
   - Include full error message
   - Show reproduction steps
   - Include environment info (Node version, OS, etc.)

---

## Reference

- [Development Commands](./commands.md) - All available commands
- [Package Structure](./packages.md) - Package details and organization
- [Development Workflows](./workflow.md) - Typical dev patterns
