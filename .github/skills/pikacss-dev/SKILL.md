---
name: pikacss-dev
description: Provides guidance for PikaCSS development including building, testing, debugging, and understanding the monorepo structure. Use when developing PikaCSS features, fixing bugs, running tests, or learning the codebase architecture.
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: developers
  workflow: development
---

# PikaCSS Development Skill

Complete guidance for developing PikaCSS including building, testing, refactoring, and releasing.

## Quick Start

New to PikaCSS development? Start here:

```bash
# Clone and setup
git clone https://github.com/anomalyco/pikacss.git
cd pikacss
pnpm install
pnpm prepare  # Setup git hooks

# Build and test
pnpm build
pnpm test

# You're ready to develop!
```

---

## Reference Navigation

This skill uses progressive disclosure. Start with the overview below, then dive into reference guides for detailed information.

### For Day-to-Day Development

**See [Development Commands Reference](./references/commands.md)**
- All `pnpm` commands you'll use
- When to use each command
- Tips for faster development
- Troubleshooting command failures

*Use this when you need to know how to build, test, or publish.*

### For Understanding the Architecture

**See [Package Structure Reference](./references/packages.md)**
- How packages are organized
- What each package does
- Dependency relationships
- When to modify each package
- How to add new packages

*Use this when you need to understand the codebase structure or locate where to make changes.*

### For Fixing Problems

**See [Debugging Guide](./references/debugging.md)**
- Common build failures and fixes
- Test troubleshooting
- Type errors and solutions
- Runtime issues and debugging
- Getting unstuck when things break

*Use this when something fails and you need to know what went wrong and how to fix it.*

### For Completing Tasks

**See [Typical Workflows](./references/workflow.md)**
- Step-by-step guides for common tasks
- Adding features
- Fixing bugs
- Creating plugins
- Preparing releases
- Working with examples

*Use this when you need a roadmap for completing a development task from start to finish.*

---

## Key Principles

### Build-Time Static Analysis

All `pika()` function calls must use **static values only**:

```typescript
// ✅ Allowed
const styles = pika({ color: 'red' })
const COLOR = 'blue'
const styles2 = pika({ color: COLOR })

// ❌ Not allowed (runtime prop)
function Component({ color }) {
  const styles = pika({ color })  // ERROR: color is runtime variable
}

// ✅ Solution: Use CSS variables
const styles = pika({ color: 'var(--color)' })
```

This is the fundamental constraint of PikaCSS. All style definitions must be evaluable at build time.

### Package Architecture

PikaCSS uses a **layered architecture** with clear separation:

```
Framework Layer (@pikacss/nuxt-pikacss)
  ↓
Bundler Layer (@pikacss/vite-plugin-pikacss)
  ↓
Universal Plugin Layer (@pikacss/unplugin-pikacss)
  ↓
Build-time Integration Layer (@pikacss/integration)
  ↓
Core Engine (@pikacss/core) + Plugins
```

Each layer depends only on the layer below it, ensuring clean dependencies and reusability.

### Monorepo Workflow

- All packages share the same version (currently 0.0.39)
- Build order is automatic via pnpm workspace
- Use `pnpm --filter @pikacss/core` to work on single packages
- Use `pnpm` without filter for full workspace commands

---

## Common Tasks At a Glance

### I want to...

**Build packages**
```bash
pnpm build                                    # All packages
pnpm --filter @pikacss/core build            # Specific package
```
See [Building](./references/commands.md#building) for details.

**Run tests**
```bash
pnpm test                                     # All tests
pnpm --filter @pikacss/core test             # Specific package
pnpm --filter @pikacss/core test:watch       # Watch mode
```
See [Testing](./references/commands.md#testing) for details.

**Check code quality**
```bash
pnpm typecheck                                # Type check
pnpm lint                                     # Lint and auto-fix
```
See [Type Checking & Linting](./references/commands.md#type-checking--linting) for details.

**Add a new feature**
1. Create branch: `git checkout -b feat/my-feature`
2. Implement in appropriate package
3. Write tests
4. Run `pnpm build && pnpm test && pnpm typecheck && pnpm lint`
5. Commit and create PR

See [Adding a New Feature](./references/workflow.md#adding-a-new-feature) for detailed steps.

**Fix a bug**
1. Create branch: `git checkout -b fix/bug-name`
2. Write reproduction test
3. Implement fix
4. Run `pnpm test` to verify
5. Commit with fixes in message

See [Fixing a Bug](./references/workflow.md#fixing-a-bug) for detailed steps.

**Create a new plugin**
```bash
pnpm newplugin my-plugin
```
Scaffolds plugin at `packages/plugin-my-plugin/`.

See [Creating a New Plugin](./references/workflow.md#creating-a-new-plugin) for detailed steps.

**Something is broken**
```bash
# Clear cache and rebuild
rimraf packages/*/dist
pnpm build
pnpm test
```
See [Debugging Guide](./references/debugging.md) for comprehensive troubleshooting.

---

## Development Environment

### Requirements

- **Node.js**: 18.17.0 or higher (see `.nvmrc` in project root)
- **pnpm**: 8.0.0 or higher
- **Git**: For version control

### Setup

```bash
# Clone repository
git clone https://github.com/anomalyco/pikacss.git
cd pikacss

# Install Node version (if using nvm)
nvm use

# Install dependencies
pnpm install

# Setup git hooks
pnpm prepare
```

### Verify Setup

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Should complete without errors
```

---

## Project Structure Overview

```
pikacss/
├── packages/
│   ├── core/                 # Core style engine
│   ├── integration/          # Build-time tools
│   ├── unplugin/            # Universal bundler plugin
│   ├── vite/                # Vite wrapper
│   ├── nuxt/                # Nuxt integration
│   ├── plugin-icons/        # Icon plugin
│   ├── plugin-reset/        # CSS reset plugin
│   └── plugin-typography/   # Typography plugin
├── docs/                     # User documentation (VitePress)
├── examples/                 # Example projects
├── .github/
│   └── skills/              # AI agent guidance (this skill is here)
├── AGENTS.md                # AI agent development guide
├── pnpm-workspace.yaml      # Monorepo configuration
└── package.json             # Root package config
```

For detailed package information, see [Package Structure Reference](./references/packages.md).

---

## Dependency Management

### Adding Dependencies

```bash
# To a specific package
pnpm --filter @pikacss/core add package-name

# To workspace root (devDependencies)
pnpm add -D package-name -w
```

### Monorepo Dependencies

Internal packages use workspace protocol:

```json
{
  "dependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

This automatically resolves to the local version.

### Peer Dependencies

All packages list `@pikacss/core` as peer dependency to ensure compatibility.

---

## Testing Strategy

### Test Organization

```
packages/[name]/tests/
├── unit/          # Pure function tests
└── integration/   # Multi-module tests
```

### Running Tests

```bash
pnpm test                               # All tests
pnpm --filter @pikacss/core test       # Specific package
pnpm --filter @pikacss/core test:watch # Watch mode
```

### Writing Tests

Tests use Vitest framework:

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature', () => {
  it('should do something', async () => {
    const result = await myFunction()
    expect(result).toBe(expected)
  })
})
```

---

## Git Workflow

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Refactoring
- `docs/description` - Documentation changes

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Refactoring
- `test` - Test additions/updates
- `docs` - Documentation changes
- `chore` - Build, deps, tooling

**Example:**
```
feat(core): add support for custom selectors

Implement $ prefix for custom selector syntax. Allows users to define
custom selectors with automatic vendor prefixing support.

Closes #123
```

---

## Before Committing

Always run this checklist:

```bash
# 1. Build all packages
pnpm build

# 2. Run all tests
pnpm test

# 3. Type checking
pnpm typecheck

# 4. Linting (auto-fixes many issues)
pnpm lint

# 5. Check status
git status

# All should pass with no errors
```

---

## Before Releasing

Run complete quality checks:

```bash
# Full build
pnpm build

# All tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Verify exports
pnpm publint

# Build documentation
pnpm docs:build

# If all pass, create release
pnpm release
```

---

## Troubleshooting

### "Cannot find module" Error

See [Debugging Guide - Build Issues](./references/debugging.md#build-issues)

### Tests Fail

See [Debugging Guide - Test Issues](./references/debugging.md#test-issues)

### Type Errors

See [Debugging Guide - Type Errors](./references/debugging.md#type-errors)

### General Troubleshooting

See [Debugging Guide](./references/debugging.md) for comprehensive help with:
- Build failures
- Test failures  
- Type errors
- Linting issues
- Runtime issues
- Package issues
- Dependency issues

---

## Useful Resources

### Documentation
- **User Guide**: `docs/guide/` - For PikaCSS users
- **Advanced Topics**: `docs/advanced/` - Technical deep dives
- **Examples**: `docs/examples/` - Code samples

### Examples
- Vite + React: `examples/vite-react/`
- Vite + Vue: `examples/vite-vue3/`
- Nuxt: `examples/nuxt/`
- Webpack: `examples/webpack-react/`

### Development Guidance
- **AGENTS.md** - AI agent maintenance guide (in project root)
- **This Skill** - Current skill documentation

---

## Next Steps

1. **New to the project?**
   - Read [Package Structure Reference](./references/packages.md) to understand architecture
   - Run `pnpm build && pnpm test` to verify setup

2. **Ready to develop?**
   - Choose your task from [Typical Workflows](./references/workflow.md)
   - Follow the step-by-step guide for your task
   - Use [Development Commands Reference](./references/commands.md) for command help

3. **Something failing?**
   - Check [Debugging Guide](./references/debugging.md)
   - Search for your error message
   - Follow the troubleshooting steps

4. **Need command help?**
   - See [Development Commands Reference](./references/commands.md)
   - All commands with explanations
   - Tips and best practices

---

## References

- [Development Commands](./references/commands.md) - Complete command reference
- [Package Structure](./references/packages.md) - Architecture and package details
- [Debugging Guide](./references/debugging.md) - Troubleshooting and debugging
- [Typical Workflows](./references/workflow.md) - Step-by-step task guides
