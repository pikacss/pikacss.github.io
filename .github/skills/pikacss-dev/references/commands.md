# Development Commands Reference

Complete reference for all pnpm commands used in PikaCSS development workflow.

## Table of Contents

- [Setup & Installation](#setup--installation)
- [Building](#building)
- [Testing](#testing)
- [Type Checking & Linting](#type-checking--linting)
- [Documentation](#documentation)
- [Publishing & Quality](#publishing--quality)
- [Scaffolding](#scaffolding)
- [Watch & Development](#watch--development)
- [Git & Hooks](#git--hooks)

---

## Setup & Installation

### Install Dependencies
```bash
pnpm install
```
Installs all dependencies in the monorepo workspace. Run this first when cloning the project.

### Setup Git Hooks
```bash
pnpm prepare
```
Configures pre-commit hooks using simple-git-hooks. Hooks run linting and formatting checks automatically.

---

## Building

### Build All Packages
```bash
pnpm build
```
Builds all packages in dependency order (core → integration → unplugin → adapters).

### Build Specific Package
```bash
pnpm --filter @pikacss/core build
```
Builds only the specified package. Useful for iterative development.

**Examples:**
```bash
# Build core package
pnpm --filter @pikacss/core build

# Build integration package
pnpm --filter @pikacss/integration build

# Build unplugin
pnpm --filter @pikacss/unplugin-pikacss build

# Build Vite plugin
pnpm --filter @pikacss/vite-plugin-pikacss build
```

### Clear Build Cache
```bash
rimraf packages/*/dist
```
Removes all dist directories. Use when build is broken or outputs are corrupted.

---

## Testing

### Run All Tests
```bash
pnpm test
```
Runs all tests in all packages using Vitest. Output shows summary and coverage.

### Test Specific Package
```bash
pnpm --filter @pikacss/core test
```
Runs tests only in the specified package. Faster when debugging single package issues.

**Examples:**
```bash
# Test core
pnpm --filter @pikacss/core test

# Test integration
pnpm --filter @pikacss/integration test

# Test unplugin
pnpm --filter @pikacss/unplugin-pikacss test
```

### Test Specific File
```bash
pnpm --filter @pikacss/core test src.test.ts
```
Runs a single test file in a package. Useful when debugging specific functionality.

### Watch Mode Testing
```bash
pnpm --filter @pikacss/core test:watch
```
Runs tests in watch mode. Tests re-run automatically when files change.

### Verbose Test Output
```bash
pnpm --filter @pikacss/core test -- --reporter=verbose
```
Shows detailed test output including individual test cases and timing.

---

## Type Checking & Linting

### Type Check All Packages
```bash
pnpm typecheck
```
Runs TypeScript type checking across all packages. Must pass before committing.

### Type Check Specific Package
```bash
pnpm --filter @pikacss/core typecheck
```
Checks types only in the specified package. Faster for focused development.

### Lint All Packages
```bash
pnpm lint
```
Runs ESLint on all packages with auto-fix enabled. Fixes formatting issues automatically.

### Lint Specific Package
```bash
pnpm --filter @pikacss/core lint
```
Lints only the specified package.

---

## Documentation

### Dev Server
```bash
pnpm docs:dev
```
Starts VitePress development server. Documentation is live at http://localhost:5173.

Changes to markdown files auto-refresh the browser. Useful for writing and testing documentation.

### Build Documentation
```bash
pnpm docs:build
```
Builds static documentation site. Output is in `docs/.vitepress/dist/`.

Must pass before merging documentation changes.

### Preview Documentation
```bash
pnpm docs:preview
```
Serves the built documentation locally for preview before publishing.

---

## Publishing & Quality

### Validate Package Exports
```bash
pnpm publint
```
Validates all package.json export maps using publint. Must pass before publishing.

**Check specific package:**
```bash
pnpm --filter @pikacss/core exec publint
```

### Release Workflow
```bash
pnpm release
```
Full release automation: builds all packages, runs tests, typechecks, validates exports, bumps version, and prepares for publication.

**Only run when ready to publish!** This command will:
1. Build all packages
2. Run full test suite
3. Type check everything
4. Validate exports with publint
5. Clean dist directories
6. Bump version using bumpp
7. Create git tag

### Prepare Local Installation
```bash
pnpm prepare:local
```
Builds packages and creates local tarballs for testing installation locally without publishing to npm.

---

## Scaffolding

### Create New Package
```bash
pnpm newpkg [dirname] [name]
```
Interactive package generator. Creates a new package under `packages/[dirname]/` with proper configuration.

**Examples:**
```bash
# Interactive mode (recommended)
pnpm newpkg

# With arguments
pnpm newpkg my-package @pikacss/my-package
```

Creates:
- `package.json` with proper exports
- `src/index.ts` entry point
- `tsconfig.json` configuration
- `tests/` directory

### Create New Plugin
```bash
pnpm newplugin [name]
```
Plugin generator. Creates a new plugin under `packages/plugin-[name]/` with plugin template.

**Examples:**
```bash
# Interactive mode
pnpm newplugin

# With name
pnpm newplugin my-feature
```

Creates:
- `package.json` with plugin setup
- `src/index.ts` with plugin template
- `tests/` with example tests
- Module augmentation setup

---

## Watch & Development

### Watch and Build
```bash
pnpm --filter @pikacss/core build:watch
```
Rebuilds the package automatically whenever source files change. Useful during development.

### Combined Watch (Build + Test)
```bash
# Terminal 1: Build in watch mode
pnpm --filter @pikacss/core build:watch

# Terminal 2: Test in watch mode
pnpm --filter @pikacss/core test:watch
```
Run in separate terminals for parallel development with immediate feedback on both compilation and tests.

---

## Git & Hooks

### Pre-commit Hooks
```bash
pnpm prepare
```
Sets up Git hooks that run automatically before commits. Hooks include:
- Linting (ESLint)
- Formatting (Prettier via lint-staged)
- Type checking (on certain files)

Hooks prevent committing code with linting/formatting issues.

---

## Tips & Best Practices

### Scoping with --filter

Use `--filter` to scope commands to specific packages:

```bash
# Single package
pnpm --filter @pikacss/core build

# Multiple packages
pnpm --filter '@pikacss/{core,integration}' test

# All except one
pnpm --filter '!@pikacss/docs' build

# Recursive (dependencies included)
pnpm --filter '@pikacss/core...' test
```

### Parallel Execution

Most commands run in parallel by default. To ensure sequential execution:

```bash
# Force sequential with --sequential flag (rarely needed)
pnpm --filter '@pikacss/core' build --sequential
```

### Dependency Order

Commands respect the dependency graph:
```
core (base)
  ↓
integration (depends on core)
  ↓
unplugin (depends on integration)
  ↓
vite, nuxt (depend on unplugin)
```

Building in this order ensures no broken dependencies.

### Common Command Patterns

**Iterative Development:**
```bash
# Make code change
# Auto-format and check
pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm --filter @pikacss/core test:watch
```

**Before Pushing:**
```bash
# Full build
pnpm build

# All tests
pnpm test

# Type checking
pnpm typecheck

# Lint check (auto-fixed already)
pnpm lint
```

**Before Releasing:**
```bash
# Run everything
pnpm build && pnpm test && pnpm typecheck && pnpm lint && pnpm publint

# If all pass, create release
pnpm release
```

---

## Troubleshooting Commands

**Build fails:**
```bash
# Clear cache
rimraf packages/*/dist

# Rebuild
pnpm build
```

**Tests fail:**
```bash
# Run with verbose output
pnpm --filter @pikacss/core test -- --reporter=verbose

# Run specific file
pnpm --filter @pikacss/core test specific.test.ts
```

**Type errors:**
```bash
# Get full list
pnpm typecheck

# Check specific package
pnpm --filter @pikacss/core typecheck
```

**Linting issues:**
```bash
# Show all issues
pnpm lint

# Auto-fix most issues
pnpm lint  # (runs with --fix by default)
```
