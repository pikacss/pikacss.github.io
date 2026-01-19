---
name: pikacss-dev
description: Help with PikaCSS development tasks including building, testing, fixing bugs, and understanding the codebase
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: developers
  workflow: development
---

## When to use me

Use this skill when working on PikaCSS development tasks:

- **Building packages**: Compiling TypeScript and testing outputs
- **Testing**: Running unit/integration tests and debugging failures
- **Bug fixes**: Locating and fixing issues in core packages
- **Code changes**: Refactoring, optimizing, or implementing features
- **Understanding structure**: Learning the monorepo layout and dependencies

---

## Quick Reference

### Key Commands

```bash
# Install dependencies
pnpm install && pnpm prepare

# Build all packages
pnpm build

# Run all tests
pnpm test

# Type checking and linting
pnpm typecheck && pnpm lint

# Development workflow
pnpm --filter @pikacss/core build:watch
pnpm --filter @pikacss/core test:watch
```

### Package Dependency Order

```
core (base engine)
  ↓
integration (build-time tools)
  ↓
unplugin (multi-bundler support)
  ↓
framework adapters (Vite, Nuxt, etc.)
```

### Important Constraint

All `pika()` function arguments must be **statically analyzable** at build time. No runtime variables, props, or dynamic expressions allowed inside `pika()` calls. See `/guide/important-concepts` for details.

---

## Common Development Tasks

### Before Making Changes

1. Read the `AGENTS.md` file in project root for architecture guidance
2. Check existing tests to understand code patterns
3. Verify scope of changes - modify only affected packages
4. Run full test suite to ensure baseline

### After Making Changes

- Build succeeds: `pnpm build`
- Tests pass: `pnpm test`
- No type errors: `pnpm typecheck`
- No linting issues: `pnpm lint`
- Git status clean

### Debug Workflow

If tests fail:

```bash
# Run specific package tests
pnpm --filter @pikacss/core test

# Run specific test file
pnpm --filter @pikacss/core test src.test.ts

# Debug with verbose output
pnpm --filter @pikacss/core test -- --reporter=verbose
```

If build fails:

```bash
# Clear build cache
rimraf packages/*/dist

# Rebuild with verbose logging
pnpm build

# Check for circular dependencies
pnpm lint
```

### Creating Plugins

```bash
# Scaffold new plugin
pnpm newplugin my-plugin

# This creates packages/plugin-my-plugin/ with:
# - package.json (properly configured)
# - src/index.ts (plugin template)
# - tests/ (test setup)
```

---

## File Organization

- `packages/core/` - Core engine (independent, no build dependencies)
- `packages/integration/` - Build-time tools
- `packages/unplugin/` - Universal bundler support
- `packages/vite/`, `packages/nuxt/` - Framework adapters
- `packages/plugin-*` - Official plugins
- `docs/` - User documentation
- `.github/skills/` - Agent guidance files

---

## References

For detailed guidance, see:

- `AGENTS.md` - Complete architecture guide
- `.github/skills/pikacss-expert/` - User API and usage
- `.github/skills/pikacss-docs/` - Documentation maintenance

