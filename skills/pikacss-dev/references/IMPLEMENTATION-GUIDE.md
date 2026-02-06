# Implementation Guide

## Decision Tree: When Adding a Feature

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
│     4. Verify: pnpm --filter @pikacss/unplugin-pikacss test
│
├─ Is it a new official plugin?
│  └─ Run pnpm newplugin <name>
│     1. Implement plugin logic in packages/plugin-<name>/src/
│     2. Set up module augmentation in src/index.ts
│     3. Write tests
│     4. Update docs/advanced/plugin-development.md
│
└─ Is it build-time integration?
   └─ Modify @pikacss/integration
      1. Add logic to packages/integration/src/
      2. Write tests
      3. Verify: pnpm --filter @pikacss/integration test
```

## Decision Tree: When Fixing a Bug

```
Bug identified in issue
├─ 1. Use grep/read to locate affected package
├─ 2. Create failing reproduction test
│     - Add test in packages/<name>/tests/
│     - Run test to confirm it fails
├─ 3. Implement fix in src/
├─ 4. Verify test passes:
│     pnpm --filter @pikacss/<pkg> test
├─ 5. Run full verification:
│     - pnpm typecheck
│     - pnpm lint
│     - pnpm build
│     - pnpm test
├─ 6. Update documentation if behavior changed
└─ 7. Create commit with clear message
```

## Implementation Checklist

Before committing any changes:

- [ ] Code in correct package (verify with ARCHITECTURE.md)
- [ ] Unit tests written and passing
- [ ] TypeScript compiles without errors: `pnpm typecheck`
- [ ] ESLint passes without warnings: `pnpm lint`
- [ ] Specific package tests pass: `pnpm --filter @pikacss/<pkg> test`
- [ ] Related documentation updated
- [ ] Type definitions accurate and complete
- [ ] No manual edits to generated files (pika.gen.*)
- [ ] No circular dependencies introduced
- [ ] Backward compatibility maintained (or major version bump)
- [ ] No non-English content in code, comments, or messages
- [ ] Commit message follows conventional commits

## Adding to @pikacss/core

### 1. Identify the Change Type

**Style processing logic?**
```
Examples: new pseudo-element support, new selector type,
new utility generation logic, new plugin hook
→ Add to core
```

**Plugin-specific?**
```
Examples: icon set defaults, reset stylesheet content,
font definitions
→ Create or update plugin
```

### 2. Implementation Steps

Create test file first:
```bash
# Create test in packages/core/tests/unit/
# Example: myFeature.test.ts
```

Write implementation:
```typescript
// packages/core/src/
// Follow existing patterns in related files
```

Update types:
```typescript
// packages/core/src/types/
// Add new types or extend existing interfaces
```

### 3. Verification

```bash
# Test only this package
pnpm --filter @pikacss/core test

# Watch mode while developing
pnpm --filter @pikacss/core test:watch

# Type check
pnpm typecheck

# Full build
pnpm build
```

## Adding to @pikacss/integration

### 1. When to Modify

**Build-time evaluation logic?**
```
Examples: scanning algorithm changes, evaluation strategy,
code transformation rules
→ Add to integration
```

### 2. Implementation Steps

Same pattern as core:

```bash
# 1. Create test file
# tests/unit/myFeature.test.ts

# 2. Implement in src/

# 3. Update exports if needed

# 4. Test
pnpm --filter @pikacss/integration test

# 5. Verify doesn't break dependent packages
pnpm --filter @pikacss/unplugin-pikacss test
```

## Creating a New Plugin

### Using the scaffolding tool

```bash
pnpm newplugin my-feature
```

This creates:
- `packages/plugin-my-feature/`
- `tsconfig` files configured
- `package.json` with proper exports
- Module augmentation setup
- Basic test file

### Plugin Implementation Pattern

```typescript
// packages/plugin-my-feature/src/index.ts
import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export interface MyFeatureOptions {
	// Options here
}

declare module '@pikacss/core' {
	interface EngineConfig {
		myFeature?: MyFeatureOptions
	}
}

export function myFeature(options?: MyFeatureOptions): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-feature',
		order: 'post', // Control execution order
		async configureEngine(engine) {
			// Register shortcuts, hooks, etc.
		}
	})
}
```

### Plugin Testing

```typescript
import { createEngine } from '@pikacss/core'
// packages/plugin-my-feature/tests/unit/myFeature.test.ts
import { describe, expect, it } from 'vitest'
import { myFeature } from '../src'

describe('my-feature plugin', () => {
	it('should configure engine correctly', () => {
		const engine = createEngine({
			plugins: [myFeature()]
		})
		// Test plugin integration
	})
})
```

## Code Style Guidelines

### TypeScript/JavaScript

```typescript
// Files
packages / core / src / myFeature.ts
packages / core / tests / unit / myFeature.test.ts

// Functions - camelCase
export function processStyles() {}
export function generateCSS() {}

// Types - PascalCase
interface MyInterface {}
interface MyType {}

// Constants - UPPER_SNAKE_CASE
const MAX_SIZE = 1024
```

### Naming Conventions

**Packages**: `@pikacss/<name>` or `@pikacss/plugin-<name>`

**File exports**: Match functionality
```typescript
// Good
export { createEngine }
export { processStyleDefinition }

// Avoid
export { x, y, z }
```

## Git Workflow

### Before Making Changes

```bash
# Get latest
git checkout main
git pull

# Create feature branch
git checkout -b feat/my-feature
```

### After Implementation

```bash
# Stage changes
git add packages/my-package/src
git add packages/my-package/tests

# Verify no uncommitted changes to dist/
git status

# Commit with message
git commit -m "feat(core): add my feature

Detailed explanation of what this feature does
and why it's needed.

Closes #123"
```

### Never Do These

```bash
# ❌ Don't force push main
git push --force origin main

# ❌ Don't commit dist/
git add dist/

# ❌ Don't commit pika.gen.*
git add pika.gen.css

# ❌ Don't bypass tests
git commit --no-verify
```

## Common Patterns

### Error Handling in Plugins

```typescript
async transformStyleDefinitions(defs) {
  try {
    // Logic here
    return processedDefs
  } catch (error) {
    console.error(`[plugin-name] Error:`, error)
    return defs // Return original to avoid breaking
  }
}
```

### Module Augmentation for Extensions

```typescript
// In your plugin or package
declare module '@pikacss/core' {
	interface EngineConfig {
		customOption?: string
	}

	interface Shortcuts {
		customShortcut: CustomDef
	}
}
```

### Type Guards

```typescript
function isStyleDefinition(value: unknown): value is StyleDefinition {
	return (
		typeof value === 'object'
		&& value !== null
		&& 'color' in value || 'display' in value
	)
}
```

## Testing Patterns

### Unit Tests

```typescript
describe('specific function', () => {
	it('should do X with input Y', () => {
		const result = functionUnderTest(input)
		expect(result)
			.toBe(expected)
	})
})
```

### Integration Tests

```typescript
describe('core with plugins', () => {
	it('should process styles with plugin chain', async () => {
		const engine = createEngine({
			plugins: [pluginA(), pluginB()]
		})
		const result = await engine.process(input)
		expect(result.css)
			.toContain('expected-class')
	})
})
```

### Async Tests

```typescript
it('should handle async operations', async () => {
	const result = await asyncFunction()
	expect(result)
		.toBeDefined()
})
```

## Debugging

### Enable verbose logging

```bash
# Run with debug environment
DEBUG=pikacss:* pnpm build

# Run test with output
pnpm --filter @pikacss/core test -- --reporter=verbose
```

### Common issues

**Type errors in build**:
```bash
pnpm typecheck --filter @pikacss/core
```

**Circular dependency**:
```bash
# Try building single package
pnpm --filter @pikacss/core build

# Check imports in src/
```

**Test failures**:
```bash
# Run single test
pnpm --filter @pikacss/core test myFeature

# Watch mode
pnpm --filter @pikacss/core test:watch myFeature
```
