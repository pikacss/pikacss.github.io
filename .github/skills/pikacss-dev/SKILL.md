---
name: pikacss-dev
description: Complete developer workflow guide for PikaCSS monorepo—covers builds, tests, linting, documentation, plugin development, release procedures, and troubleshooting for contributors.
license: MIT
compatibility: Requires Node.js 18+ and pnpm 10.24.0 in a workspace checkout.
metadata:
  repo: pikacss
  version: 0.0.39
allowed-tools: bash read
---

## Overview

This skill provides comprehensive guidance for developing and maintaining the PikaCSS monorepo. It covers:
- Complete build and test workflows
- Package structure and dependencies
- Plugin development procedures
- Documentation maintenance
- Release pipeline
- Debugging strategies

## Environment Setup

### Prerequisites
- **Node.js**: 18+ (LTS recommended)
- **pnpm**: 10.24.0+ (workspace manager)
- **Git**: For version control and hooks

### Initial Setup
```bash
# Clone and enter repository
git clone https://github.com/pikacss/pikacss.git
cd pikacss

# Install dependencies
pnpm install

# Setup git hooks (pre-commit linting)
pnpm prepare
```

### Verify Setup
```bash
# Check versions
node --version        # Should be 18.0.0+
pnpm --version        # Should be 10.24.0+

# Run quick tests
pnpm test             # Should pass all tests
pnpm typecheck        # Should have no errors
pnpm lint             # Should pass linting
```

---

## Core Development Workflows

### Building

**Build all packages**:
```bash
pnpm build                    # Build everything
pnpm build --report-summary   # Show build summary
pnpm build --reporter=verbose # Detailed output
```

**Build specific package**:
```bash
pnpm --filter @pikacss/core build
pnpm --filter @pikacss/{core,integration} build
pnpm --filter '!@pikacss/docs' build
```

**Watch mode (for development)**:
```bash
pnpm --filter @pikacss/core build:watch
# Automatically rebuilds when files change
```

**Troubleshooting build failures**:
```bash
# Clear build artifacts
rimraf packages/*/dist

# Clear all cache
rimraf packages/*/{dist,.tsc-cache}
pnpm store prune

# Check tsconfig syntax
pnpm typecheck --filter @pikacss/core

# Rebuild from scratch
pnpm --filter @pikacss/core build --force
```

### Testing

**Run all tests**:
```bash
pnpm test                     # Run once
pnpm test --reporter=verbose  # Detailed output
pnpm test --no-coverage       # Skip coverage
```

**Test specific package**:
```bash
pnpm --filter @pikacss/core test
pnpm --filter @pikacss/{core,integration} test
```

**Watch mode (for TDD)**:
```bash
pnpm test:watch
pnpm --filter @pikacss/core test:watch
```

**Run specific test file**:
```bash
pnpm --filter @pikacss/core test atomicStyles.test.ts
pnpm --filter @pikacss/core test -t "should generate atomic style"  # Match by name
```

**Coverage reports**:
```bash
pnpm test:coverage           # Generate coverage
# View at coverage/index.html
```

**Debugging failing tests**:
```bash
# Run with verbose logging
pnpm --filter @pikacss/core test --reporter=verbose

# Run single test in isolation
pnpm --filter @pikacss/core test -t "specific test name only"

# Check test output
pnpm --filter @pikacss/core test 2>&1 | head -100
```

### Type Checking

```bash
# Check all packages
pnpm typecheck

# Check specific package
pnpm typecheck --filter @pikacss/core

# Detailed type errors
pnpm typecheck --noEmit

# Generate declaration files
pnpm typecheck --declaration
```

### Linting & Formatting

```bash
# Lint all files (auto-fix enabled)
pnpm lint

# Lint specific package
pnpm --filter @pikacss/core lint

# Check without fixing
pnpm lint --no-fix

# Lint specific file pattern
pnpm lint 'packages/core/src/**/*.ts'
```

### Documentation

**Development server**:
```bash
pnpm docs:dev
# Access at http://localhost:5173
# Auto-reloads on file changes
```

**Build documentation site**:
```bash
pnpm docs:build
```

**Preview built site**:
```bash
pnpm docs:preview
# Serves the built site locally
```

**Common documentation tasks**:
```bash
# Update API reference
# Edit: docs/advanced/api-reference.md

# Add new guide
# Create: docs/guide/new-topic.md
# Update: docs/.vitepress/config.ts (add to sidebar)

# Update examples
# Edit: docs/examples/*.md

# Check for broken links
# Run: pnpm docs:build (check for warnings)
```

---

## Package Architecture & Dependencies

### Monorepo Structure

```
packages/
├── core/                      # Style engine (no deps except csstype)
├── integration/               # Build tool wrapper (depends on core)
├── unplugin-pikacss/          # Universal bundler plugin (depends on integration)
├── vite-plugin-pikacss/       # Vite shortcut (depends on unplugin)
├── nuxt-pikacss/              # Nuxt module (depends on unplugin)
├── plugin-icons/              # Icons plugin (depends on core)
├── plugin-reset/              # CSS reset plugin (depends on core)
└── plugin-typography/         # Typography plugin (depends on core)

docs/                          # VitePress documentation site
.github/skills/                # Agent skill files
```

### Build Order

Dependencies flow: **core** → **integration** → **unplugin** → **framework adapters** and **plugins**

When modifying:
1. **core**: Test in isolation, then test integration downstream
2. **integration**: Test core still passes, then test unplugin
3. **unplugin**: Test downstream (vite, nuxt) if changes affect API
4. **plugins**: Only depend on core, can be tested independently

### Package Dependencies Reference

| Package | Purpose | Depends On |
|---------|---------|-----------|
| `@pikacss/core` | Style processing engine | None (external: csstype) |
| `@pikacss/integration` | Build-time code scanning & generation | core |
| `@pikacss/unplugin-pikacss` | Multi-bundler plugin wrapper | integration |
| `@pikacss/vite-plugin-pikacss` | Vite-specific convenience | unplugin |
| `@pikacss/nuxt-pikacss` | Nuxt module | unplugin |
| `@pikacss/plugin-icons` | Icon system | core |
| `@pikacss/plugin-reset` | CSS reset options | core |
| `@pikacss/plugin-typography` | Typography system | core |

### Using pnpm Filters

```bash
# Single package
pnpm --filter @pikacss/core build

# Multiple packages (comma-separated)
pnpm --filter @pikacss/{core,integration} test

# Exclude packages
pnpm --filter '!@pikacss/docs' build
pnpm --filter '!@pikacss/plugin-*' test

# Exclude by pattern
pnpm --filter '!**/docs' build
```

---

## Creating New Packages & Plugins

### Create New Package

```bash
pnpm newpkg <directory> <package-name>

# Example: New bundler integration
pnpm newpkg rspack-plugin @pikacss/rspack-plugin

# Creates:
# - packages/rspack-plugin/
# - Proper tsconfig, package.json, test setup
```

### Create New Plugin

```bash
pnpm newplugin <plugin-name>

# Example: Colors plugin
pnpm newplugin colors

# Creates:
# - packages/plugin-colors/
# - Pre-configured for plugin development
# - Includes module augmentation template
```

### Plugin Structure

```typescript
// packages/plugin-<name>/src/index.ts

import { defineEnginePlugin } from '@pikacss/core'

declare module '@pikacss/core' {
  interface EngineConfig {
    myPlugin?: MyPluginOptions
  }
  interface Shortcuts {
    myShortcut: MyShortcutDefinition
  }
}

export interface MyPluginOptions {
  // Configuration options
}

export function myPlugin(options?: MyPluginOptions): EnginePlugin {
  return defineEnginePlugin({
    name: 'my-plugin',
    order: 'post', // 'pre' | undefined | 'post'
    
    async configureEngine(engine) {
      // Register shortcuts
      engine.registerShortcut('myShortcut', { ... })
    },
    
    async transformStyleDefinitions(defs) {
      // Transform style definitions before processing
      return defs
    },
    
    async finalize(engine) {
      // Final processing after all styles are processed
    }
  })
}
```

### Plugin Best Practices

1. **Always use try/catch** for error handling
   ```typescript
   async transformStyleDefinitions(defs) {
     try {
       // processing
     } catch (error) {
       console.error('[my-plugin] Error:', error)
       return defs // Return original on error
     }
   }
   ```

2. **Test in isolation**
   ```bash
   pnpm --filter @pikacss/plugin-<name> test
   ```

3. **Update type definitions** when changing API
   ```typescript
   declare module '@pikacss/core' {
     interface EngineConfig {
       myPlugin?: MyOptions
     }
   }
   ```

4. **Document shortcuts and selectors**
   ```bash
   # Add docs to: docs/plugins/<name>.md
   # Update: docs/guide/plugin-system.md
   ```

---

## Plugin Development Workflow

### 1. Setup
```bash
pnpm newplugin my-plugin
cd packages/plugin-my-plugin
```

### 2. Implement
- Edit `src/index.ts` with plugin logic
- Update module augmentation for types
- Register shortcuts/selectors/preflights

### 3. Test
```bash
pnpm test --watch
```

Write tests for each plugin hook:
- `configureEngine` - Setup and registration
- `transformStyleDefinitions` - Style transformation
- `finalize` - Cleanup and post-processing

### 4. Document
- Create `docs/plugins/my-plugin.md`
- Update `docs/guide/plugin-system.md`
- Add usage examples

### 5. Integrate
```bash
# Add to test project
cd ../unplugin-pikacss/tests

# Import and use plugin
import { myPlugin } from '@pikacss/plugin-my-plugin'

// Configure in test
export default defineEngineConfig({
  plugins: [myPlugin()]
})
```

### 6. Release
- Follow standard release procedures
- Update CHANGELOG
- Tag release with version number

---

## Testing Strategy & Patterns

### Test Organization

```
packages/<name>/tests/
├── unit/              # Pure function tests
│   ├── core.test.ts
│   └── utils.test.ts
├── integration/       # Multi-module tests
│   ├── engine.test.ts
│   └── plugins.test.ts
└── e2e/              # End-to-end tests
    └── transformation.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Feature', () => {
  let engine: Engine
  
  beforeEach(async () => {
    // Setup
    engine = await createEngine(config)
  })
  
  afterEach(() => {
    // Cleanup
    // ...
  })
  
  it('should do something', async () => {
    // Arrange
    const input = { color: 'red' }
    
    // Act
    const result = await engine.use(input)
    
    // Assert
    expect(result).toEqual(['a'])
  })
  
  it('should handle edge cases', () => {
    expect(() => engine.use(null)).toThrow()
  })
})
```

### Running Tests Efficiently

```bash
# All tests
pnpm test

# Specific package (fast)
pnpm --filter @pikacss/core test

# Watch mode (for development)
pnpm test:watch

# Specific test file
pnpm --filter @pikacss/core test atomicStyles.test.ts

# Tests matching pattern
pnpm --filter @pikacss/core test -t "atomic"

# With coverage
pnpm test:coverage
```

---

## Advanced Development Tasks

### Inter-Package Communication

```typescript
// Good: Use exported public API
import { createEngine } from '@pikacss/core'

// Bad: Import internal implementation
import { createAtomicId } from '@pikacss/core/src/internal/id'
```

**Dependency flow**:
```
Application Code
    ↓
@pikacss/unplugin-pikacss (bundler plugin)
    ↓
@pikacss/integration (build-time transformation)
    ↓
@pikacss/core (style engine)
    ↓
Plugins (icons, reset, typography, custom)
```

### Module Resolution

The monorepo uses workspace protocol for internal dependencies:

```json
{
  "dependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

When publishing:
- `workspace:*` → `^X.Y.Z` (compatible version)
- Automatically resolved by pnpm

### Circular Dependency Detection

```bash
# Check for circular dependencies
pnpm lint

# Manually trace dependencies
pnpm ls @pikacss/core  # Show dependency tree

# Review package.json
cat packages/unplugin/package.json | grep '"dependencies"' -A 5
```

---

## Documentation Maintenance

### Adding Documentation

**User guides**: `docs/guide/*.md`
```bash
# Structure
## Heading
### Subheading

# Examples
pika({ color: 'red' })
```

**API reference**: `docs/advanced/api-reference.md`
- Document public APIs only
- Include TypeScript types
- Provide usage examples

**Examples**: `docs/examples/*.md`
- Real-world use cases
- Runnable code samples
- Common patterns

### Updating for Releases

1. Update `docs/advanced/api-reference.md` for API changes
2. Update `docs/guide/` for new features
3. Update version numbers in documentation
4. Test examples with new version: `pnpm docs:build`
5. Update `AGENTS.md` if major changes
6. Review `.github/skills/pikacss-expert/SKILL.md`

### Documenting Plugins

1. Create `docs/plugins/<name>.md` with:
   - Overview
   - Installation
   - Configuration
   - Usage examples
   - API reference

2. Update `docs/guide/plugin-system.md`:
   - Add to "Official Plugins" list
   - Add brief description

3. Update type documentation:
   - Document module augmentation
   - Show configuration options
   - Provide TypeScript examples

---

## Release Pipeline

### Pre-Release Checklist

```bash
# 1. Ensure clean state
git status          # No uncommitted changes

# 2. Run all checks
pnpm build          # All packages build
pnpm test           # All tests pass
pnpm typecheck      # No type errors
pnpm lint           # Linting passes
pnpm publint        # Exports valid

# 3. Documentation
pnpm docs:build     # Docs build without errors

# 4. Verify AGENTS.md
# Manual: Review AGENTS.md for accuracy
```

### Version Bumping

```bash
# Interactive version selection
pnpm release

# Options:
# - patch (0.0.X): Bug fixes
# - minor (0.X.0): New features (backward compatible)
# - major (X.0.0): Breaking changes

# What it does:
# 1. Updates version in all package.json
# 2. Creates git tag
# 3. Creates git commit

# What it doesn't do:
# 1. Push to remote
# 2. Publish to npm (manual step)
```

### Publishing

```bash
# After pnpm release completes:

# Verify changes
git log --oneline -5
git tag

# Push to remote
git push
git push --tags

# Publish to npm
pnpm publish:packages
```

---

## Debugging & Troubleshooting

### Build Issues

**tsdown compilation fails**:
```bash
# Clear and rebuild
rimraf packages/*/dist
pnpm build

# Check specific package
pnpm --filter @pikacss/core build

# Check tsconfig syntax
pnpm typecheck
```

**Circular dependencies**:
```bash
# Detect circular deps
pnpm lint

# Trace dependencies
cat packages/*/package.json | grep -A 3 '"dependencies"'

# Solution: Reorganize packages or use different import paths
```

### Type Errors

**TypeScript compilation fails**:
```bash
# Full type check
pnpm typecheck

# Specific package
pnpm typecheck --filter @pikacss/core

# Check generated types
ls -la packages/*/src/types/
```

**Module not found**:
```bash
# Verify exports in package.json
cat packages/core/package.json | grep -A 10 '"exports"'

# Check built files exist
ls -la packages/core/dist/

# Rebuild package
pnpm --filter @pikacss/core build --force
```

### Test Failures

**Tests fail only in CI**:
```bash
# Run exact same test suite
pnpm test --reporter=verbose

# Check Node version
node --version

# Check for timing issues
pnpm test --reporter=verbose 2>&1 | grep -i timeout
```

**Flaky tests**:
```bash
# Run same test multiple times
for i in {1..5}; do pnpm test --run; done

# Isolate test
pnpm test -t "specific test name only"

# Check for timing dependencies
grep -r "setTimeout\|setTimeout\|sleep" packages/*/tests/
```

### Development Server Issues

**pnpm docs:dev fails**:
```bash
# Clear cache
rimraf docs/.vitepress/cache
rimraf docs/.vitepress/dist

# Restart with verbose output
pnpm docs:dev --force

# Check for broken links in config
cat docs/.vitepress/config.ts
```

**HMR not working**:
```bash
# Restart dev server
# Check file permissions: chmod +x files if needed
# Check port availability: lsof -i :5173
```

---

## Workflow Examples

### Adding a New Core Feature

```bash
# 1. Create feature branch
git checkout -b feat/my-feature

# 2. Implement in core
# Edit: packages/core/src/my-feature.ts
# Edit: packages/core/tests/unit/my-feature.test.ts

# 3. Type checking
pnpm typecheck --filter @pikacss/core

# 4. Test in isolation
pnpm --filter @pikacss/core test --watch

# 5. Update documentation
# Edit: docs/advanced/api-reference.md
# Edit: docs/guide/basics.md (if user-facing)

# 6. Full verification
pnpm build
pnpm typecheck
pnpm lint
pnpm test

# 7. Commit and push
git add -A
git commit -m "feat(core): add my feature"
git push origin feat/my-feature
```

### Fixing a Bug

```bash
# 1. Create reproduction test
# Edit: packages/affected-package/tests/unit/bug.test.ts
pnpm --filter @pikacss/affected-package test --watch

# 2. Implement fix
# Edit: packages/affected-package/src/buggy-file.ts

# 3. Verify test passes
# In watch mode: save and see test pass

# 4. Ensure no regressions
pnpm test

# 5. Commit with reference
git commit -m "fix: resolve issue with X

Fixes #123
- Test added to prevent regression
- Verified in affected packages"
```

### Creating a New Plugin

```bash
# 1. Scaffold plugin
pnpm newplugin my-feature

# 2. Implement in src/index.ts
# 3. Add tests
pnpm --filter @pikacss/plugin-my-feature test --watch

# 4. Document
# Create: docs/plugins/my-feature.md
# Update: docs/guide/plugin-system.md

# 5. Test integration
pnpm build
pnpm test

# 6. Create PR
git add -A
git commit -m "feat(plugin-my-feature): add plugin"
```

---

## Quick Reference

### Essential Commands
```bash
pnpm install              # Setup
pnpm prepare              # Setup hooks

pnpm build                # Build all
pnpm test                 # Test all
pnpm typecheck            # Type check
pnpm lint                 # Lint/format

pnpm docs:dev             # Dev docs
pnpm release              # Bump version

pnpm --filter @pikacss/core build    # Single package
pnpm --filter @pikacss/core test     # Single package test
```

### Filter Patterns
```bash
pnpm --filter @pikacss/core          # Single package
pnpm --filter @pikacss/{core,integration}  # Multiple
pnpm --filter '!@pikacss/docs'       # Exclude docs
pnpm --filter '*plugin*'             # All plugins
```

### Documentation Locations
```
User guides:       docs/guide/*.md
API reference:     docs/advanced/api-reference.md
Plugin docs:       docs/plugins/*.md
Examples:          docs/examples/*.md
Maintenance:       AGENTS.md
Dev workflow:      .github/skills/pikacss-dev/SKILL.md
User help:         .github/skills/pikacss-expert/SKILL.md
```

---

## Additional Resources

- **AGENTS.md** - AI agent maintenance guide
- **pikacss-expert SKILL** - User guidance for PikaCSS
- **pikacss-docs SKILL** - Documentation maintenance
- **docs/advanced/plugin-development.md** - Plugin development deep dive
- **docs/advanced/architecture.md** - Architecture overview

---

**Last Updated**: 2026-01-19
**Version**: 0.0.39
**Status**: Production Ready
