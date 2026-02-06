<!-- eslint-disable -->
# AGENTS.md - PikaCSS AI Agent Maintenance Guide

> 📋 **Document Purpose**: Provide AI agents with comprehensive guidance for maintaining the PikaCSS monorepo project at the architecture, implementation, and release level.

## 🌍 Language Policy

**CRITICAL RULE: All documentation, code comments, commit messages, and project files MUST be written in English.**

This requirement applies to:
- ✅ All markdown documentation files (*.md)
- ✅ All code comments (TypeScript, JavaScript, Vue, etc.)
- ✅ JSDoc annotations
- ✅ Git commit messages
- ✅ README files
- ✅ Configuration file comments
- ✅ Test descriptions and assertions
- ✅ Error messages and console logs
- ✅ Variable names and function names

**Enforcement**: All PRs with non-English content (except test fixtures) will be rejected.

---

## 📚 Guidance Documentation

This document guides AI agents in maintaining project internals. For specialized topics:

- **[pikacss-dev Skill](.github/skills/pikacss-dev/SKILL.md)** - Comprehensive developer workflow guide
- **[pikacss-expert Skill](.github/skills/pikacss-expert/SKILL.md)** - User guidance for PikaCSS API and configuration
- **[pikacss-docs Skill](.github/skills/pikacss-docs/SKILL.md)** - Documentation maintenance procedures

---

## 🏗️ Project Architecture

### Monorepo Structure

**Tech Stack**:
- **Monorepo Tool**: pnpm workspace
- **Build Tool**: tsdown (TypeScript bundler)
- **Test Framework**: Vitest
- **Linter**: ESLint (@antfu/eslint-config)
- **Documentation**: VitePress
- **Version Management**: bumpp

### Layered Package Architecture

```
┌─────────────────────────────────────────────────────┐
│  Framework Layer (Nuxt, etc.)                       │
│  @pikacss/nuxt-pikacss                             │
├─────────────────────────────────────────────────────┤
│  Unplugin Layer (Multi-bundler support)            │
│  @pikacss/unplugin-pikacss                         │
│  @pikacss/vite-plugin-pikacss                      │
├─────────────────────────────────────────────────────┤
│  Integration Layer (Build-time tools)              │
│  @pikacss/integration                              │
├─────────────────────────────────────────────────────┤
│  Core Layer (Style engine)                         │
│  @pikacss/core                                     │
│                                                     │
│  Official Plugins                                  │
│  @pikacss/plugin-icons                            │
│  @pikacss/plugin-reset                            │
│  @pikacss/plugin-typography                       │
│                                                     │
│  Verification Tools (Development)                  │
│  @pikacss/api-verifier                            │
└─────────────────────────────────────────────────────┘
```

### Package Responsibilities

**`@pikacss/core`** - Style processing engine
- Parse style definition objects, execute plugin hooks
- Generate atomic styles, manage preflights/shortcuts/selectors
- Independent from build tools, only depends on `csstype`
- Provides complete TypeScript types

**`@pikacss/integration`** - Build-time integration layer
- Scan source code for `pika()` calls using configurable patterns
- Evaluate style arguments using `new Function()` at build time
- Transform code and replace function calls with generated class names
- Generate `pika.gen.css` (atomic styles) and `pika.gen.ts` (type definitions)
- Provide `createCtx()` API and `IntegrationContext` for plugin developers
- Only depends on @pikacss/core (plus build utilities like globby, jiti, magic-string)

**`@pikacss/unplugin-pikacss`** - Universal bundler plugin
- Wrap integration layer using unplugin
- Support multiple bundlers (Vite, Webpack, Rollup, Esbuild, Rspack, Farm, Rolldown)
- Handle virtual modules and HMR

---

## 🔧 Development Commands

### Setup
```bash
pnpm install          # Install dependencies
pnpm prepare          # Setup git hooks
```

### Building & Testing
```bash
pnpm build                              # Build all packages
pnpm --filter @pikacss/core build      # Build specific package
pnpm test                               # Run all tests
pnpm typecheck                          # Type check all packages
pnpm lint                               # Lint and auto-fix
```

### Scaffolding
```bash
pnpm newpkg [dirname] [name]    # Create new package
pnpm newplugin [name]           # Create new plugin
```

### Documentation
```bash
pnpm docs:dev          # Dev server
pnpm docs:build        # Build docs
```

### Release
```bash
pnpm publint           # Verify package.json exports
pnpm release           # Version bump using bumpp
```

---

## 🎯 Maintenance Decision Trees

### When Adding a Feature

```
Need to add feature?
├─ Is it style processing logic?
│  └─ Modify @pikacss/core
│     1. Implement in packages/core/src/
│     2. Write tests in packages/core/tests/
│     3. Update type definitions
│     4. Verify: pnpm --filter @pikacss/core test
│
├─ Is it build tool integration?
│  └─ Modify @pikacss/unplugin-pikacss
│     1. Add entry point in packages/unplugin/src/
│     2. Update package.json exports
│     3. Write tests
│
└─ Is it a new plugin?
   └─ Run pnpm newplugin <name>
      1. Implement plugin logic
      2. Write tests
      3. Add module augmentation
```

### When Fixing a Bug

```
Bug identified
├─ 1. Locate affected package (use read/grep tools)
├─ 2. Create reproduction test
├─ 3. Implement fix
├─ 4. Verify: pnpm --filter @pikacss/<pkg> test
├─ 5. Run: pnpm typecheck && pnpm lint
└─ 6. Update docs if behavior changed
```

### When Releasing

```
Prepare release
├─ 1. Ensure all tests pass
│     ├─ pnpm build
│     ├─ pnpm test
│     ├─ pnpm typecheck
│     ├─ pnpm lint
│     └─ pnpm publint
├─ 2. Check documentation
│     ├─ pnpm docs:build
│     └─ Review/update AGENTS.md if major changes
├─ 3. Bump version
│     └─ pnpm release
└─ 4. Publish
      └─ pnpm publish:packages
```

---

## 🔍 Technical Foundation

### Build-Time Evaluation Constraint

All `pika()` arguments must be statically analyzable - no runtime variables:

```typescript
// ✅ Allowed (static)
const styles = pika({ color: 'red' })
const COLOR = 'blue'
const styles2 = pika({ color: COLOR })

// ❌ Not allowed (runtime)
function Component({ color }) {
	const styles = pika({ color }) // color is runtime variable
}

// ✅ Solution: CSS variables
const styles = pika({ color: 'var(--color)' })
```

### TypeScript Configuration

Each package has 3 tsconfig files:
- `tsconfig.json` - References both package and test configs
- `tsconfig.package.json` - Package code (`src/**/*`)
- `tsconfig.tests.json` - Test code (`tests/**/*`)

### Plugin Module Augmentation Pattern

Plugins extend core types via declaration merging:

```typescript
declare module '@pikacss/core' {
	interface EngineConfig {
		myPluginOption?: MyOptions
	}
	interface Shortcuts {
		myShortcut: MyShortcutDefinition
	}
}

export function myPlugin(options?: MyOptions): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',
		async configureEngine(engine) {
			engine.shortcuts.add(['myShortcut', { /* shortcut definition */ }])
		}
	})
}
```

### Auto-Generated Files

These files are generated and should **never be manually edited**:
- `pika.gen.css` - Generated CSS styles
- `pika.gen.ts` - TypeScript type definitions
- `dist/**/*` - Build output

---

## 🛠️ Agent Working Principles

### Before Making Changes

1. **Understand the codebase**
   - Use `read` tool to examine relevant files
   - Use `grep` tool to find related code
   - Check existing tests for patterns
   - Verify scope of changes

2. **Follow conventions**
   - Code style consistent with existing files
   - Naming follows project standards (camelCase for functions, PascalCase for types)
   - Test patterns match existing tests
   - TypeScript configs follow established structure

3. **Make incremental changes**
   - One logical change at a time
   - Build succeeds after each change
   - Run tests frequently to verify
   - No half-finished features

### Tool Usage

**For Understanding Code**:
- `read` - Read complete files for context
- `glob` - Find files by pattern
- `grep` - Search for specific strings/patterns
- `bash` - Run git commands to understand history

**For Implementation**:
- `edit` - Single targeted edit
- `write` - Create new files (use sparingly)
- `bash` - Run build/test commands

**For Verification**:
- `bash` - Run: `pnpm test`, `pnpm typecheck`, `pnpm lint`
- `read` - Verify change results
- `bash` - Run: `git status`, `git diff`

### Complete Implementation Checklist

- [ ] Code implementation in correct package
- [ ] Unit tests written and passing
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (no warnings)
- [ ] Related documentation updated
- [ ] Type definitions accurate
- [ ] No manual edits to generated files
- [ ] No circular dependencies
- [ ] Backward compatibility maintained (unless major version)

---

## 📊 Important Design Principles

### Naming Conventions

```typescript
// Packages
@pikacss/<name>           // General
@pikacss/plugin-<name>    // Plugin

// Files
camelCase.ts              // General files
kebab-case.ts             // Alternative
index.ts                  // Entry point

// Types
interface MyInterface {}  // PascalCase
type MyType = {}          // PascalCase

// Functions
function myFunction() {}  // camelCase
export const myFunction = () => {}  // camelCase
```

### Plugin System Best Practices

1. **Execution Order**: Control via `order` field
   - `'pre'`: Execute before built-in plugins
   - `undefined`: Normal order (default)
   - `'post'`: Execute after built-in plugins

2. **Error Handling**: Wrap operations that may fail
   ```typescript
   async transformStyleDefinitions(defs) {
     try {
       // ... logic
     } catch (error) {
       console.error(`[plugin] Error:`, error)
       return defs // Return original to avoid breaking flow
     }
   }
   ```

3. **Peer Dependencies**: Always list `@pikacss/core` as peer dependency
   ```json
   {
   	"peerDependencies": {
   		"@pikacss/core": "workspace:*"
   	}
   }
   ```

---

## ⚠️ Critical Rules for Agents

### Never Do These

1. **Do not manually edit auto-generated files**
   - `pika.gen.css`, `pika.gen.ts`, `dist/**/*`

2. **Do not bypass build-time constraints**
   - All `pika()` arguments must be statically evaluable
   - No runtime style evaluation

3. **Do not break backward compatibility** (unless major version)
   - Don't remove public APIs
   - Don't change API behavior
   - Don't modify defaults

4. **Do not skip tests**
   - All changes need corresponding tests
   - All tests must pass before commit

5. **Do not ignore TypeScript errors**
   - `pnpm typecheck` must pass completely
   - No `@ts-ignore` unless absolutely necessary

### Do These

1. **Prioritize parallel tool calls**
   - Read multiple related files simultaneously
   - Use `bash` for multiple independent commands

2. **Keep changes atomic**
   - Each commit = one complete logical change
   - Must build, test, and deploy independently

3. **Provide clear context**
   - Explain why making this change
   - Describe scope of impact
   - List verification steps

4. **Follow semantic versioning**
   - patch: bug fixes
   - minor: new features (backward compatible)
   - major: breaking changes

5. **Maintain documentation**
   - Update docs when code changes
   - Ensure examples are tested and accurate
   - Keep internal guidance (this file) current

---

## 🧪 Testing Strategy

### Test Organization

```
packages/<name>/tests/
  ├── unit/             # Pure function tests
  ├── integration/      # Multi-module tests
  └── e2e/             # End-to-end tests
```

### Running Tests

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @pikacss/core test

# Watch mode
pnpm --filter @pikacss/core test:watch

# Specific test file
pnpm --filter @pikacss/core test <filename>
```

### Test Pattern

```typescript
import { describe, expect, it } from 'vitest'

describe('Feature', () => {
	it('should do something', async () => {
		const result = await functionUnderTest()
		expect(result)
			.toBe(expected)
	})
})
```

---

## 📋 Release Checklist

Before running `pnpm release`:

- [ ] All features implemented
- [ ] All tests passing: `pnpm test`
- [ ] All types correct: `pnpm typecheck`
- [ ] All linting passes: `pnpm lint`
- [ ] Package exports valid: `pnpm publint`
- [ ] Documentation builds: `pnpm docs:build`
- [ ] Example code tested and works
- [ ] AGENTS.md reviewed and updated if major changes
- [ ] No breaking changes without major version bump
- [ ] All commits follow git standards

After Release:
- [ ] NPM publish succeeds
- [ ] Documentation deployed
- [ ] GitHub release created (automated)

---

## 🐛 Common Issues & Solutions

### Build Failures

**Issue**: tsdown fails
- Clear dist folders: `rimraf packages/*/dist`
- Check tsconfig.json syntax
- Verify no circular dependencies

**Issue**: Type errors
- Run `pnpm typecheck --filter <package>`
- Check imports point to correct types
- Verify tsconfig includes

### Test Failures

**Issue**: Tests fail only in CI
- Run full test suite locally: `pnpm test`
- Check for timing-dependent tests
- Verify environment variables set

**Issue**: Flaky tests
- Isolate test dependencies
- Use `beforeEach` for setup
- Avoid shared mutable state

### Dependency Issues

**Issue**: Circular dependencies
- Use `pnpm --filter` to isolate
- Review package.json dependencies
- Consider splitting packages

---

## 📝 Commit Message Guidelines

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `test` - Test additions/updates
- `docs` - Documentation changes
- `chore` - Build, deps, tooling

Example:
```
feat(core): add support for pseudo-elements

Implement parsing and generation of pseudo-elements
with $ selector syntax. Supports ::before, ::after,
::first-line, ::first-letter patterns.

Closes #123
```

---

## 📊 Project Statistics

### Current Version
- **Version**: 0.0.39
- **Release Strategy**: Unified version for all packages
- **Version Tool**: bumpp

### Package Dependencies

| Package | Role | Dependencies |
|---------|------|---|
| @pikacss/core | Style engine | 0 (only csstype) |
| @pikacss/integration | Build tools | 1 (core) |
| @pikacss/unplugin-pikacss | Universal plugin | 2 (integration) |
| @pikacss/vite-plugin-pikacss | Vite wrapper | 3 (unplugin) |
| @pikacss/nuxt-pikacss | Nuxt module | 3 (unplugin) |
| @pikacss/plugin-icons | Icon system | 1 (core) |
| @pikacss/plugin-reset | CSS reset | 1 (core) |
| @pikacss/plugin-typography | Typography | 1 (core) |
| @pikacss/api-verifier | Verification | 1 (core) |

---

## 🎯 File Organization Guide

### When Adding New Files

- **New package**: Use `pnpm newpkg <dir> <name>`
- **New plugin**: Use `pnpm newplugin <name>`
- **New test**: Place in `packages/<name>/tests/<category>/`
- **New type definition**: Add to package's `src/types/`

### Documentation Locations

- **API Reference**: `docs/advanced/api-reference.md`
- **Plugin Development**: `docs/advanced/plugin-development.md`
- **User Guide**: `docs/guide/`
- **Examples**: `docs/examples/`

---

## 🚀 Advanced Monorepo Patterns

### Dependency Resolution

The monorepo uses workspace protocol. Internal dependencies:

```json
{
	"dependencies": {
		"@pikacss/core": "workspace:*"
	}
}
```

Build order: **core** → **integration** → **unplugin** → **framework adapters**

### Inter-Package Communication

```
@pikacss/core
  ├── Exports engine API
  ├── No external dependencies (except csstype)
  └── Used by all other packages

@pikacss/integration
  ├── Uses core for style processing
  ├── Provides low-level integration API
  └── Used by unplugin

@pikacss/unplugin-pikacss
  ├── Uses integration layer
  ├── Multi-bundler support
  └── Used by framework adapters

@pikacss/nuxt-pikacss
  └── Uses unplugin with Nuxt-specific config
```

### Filter Usage

```bash
# Work on single package
pnpm --filter @pikacss/core build

# Work on multiple packages
pnpm --filter @pikacss/{core,integration} test

# Exclude packages
pnpm --filter '!@pikacss/docs' build
```

---

## 📚 Learning Resources

**Official Docs**:
- `docs/advanced/architecture.md` - Architecture deep dive
- `docs/advanced/plugin-development.md` - Plugin development guide
- `docs/advanced/api-reference.md` - Complete API documentation

**Skills**:
- `.github/skills/pikacss-dev/SKILL.md` - Developer workflows
- `.github/skills/pikacss-expert/SKILL.md` - User guidance
- `.github/skills/pikacss-docs/SKILL.md` - Documentation maintenance

**External**:
- UnoCSS - Design philosophy reference
- unplugin - Universal plugin system
- Vitest - Test framework documentation

---

## 🔄 Transformation Pipeline (Reference)

The style transformation happens in 6 steps:

```
Source Code
    ↓
[1] Detect pika() calls (RegExp scan)
    ↓
[2] Build-time evaluation (new Function())
    ↓
[3] Core Engine processing (plugin hooks)
    ↓
[4] Code rewriting (replace with class names)
    ↓
[5] CSS generation (atomic rules, preflights, keyframes)
    ↓
[6] TypeScript generation (type definitions, autocomplete)
    ↓
Final Output
```

---

**Last Updated**: 2026-01-19
**Maintainers**: PikaCSS Team
**Document Version**: 2.0.0
